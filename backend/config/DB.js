const mysql = require("promise-mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MAX_USERS_PER_COURSE = 22;

require("dotenv").config();

let connection;

mysql
  .createConnection({
    host: "localhost",
    user: process.env.U_NAME,
    password: process.env.PASS,
    database: "CourseProj",
  })
  .then((conn) => {
    connection = conn;
    console.log("connected to DB");
  });

//-----------------------------------------------------------------
function addUser(req, res) {
  const Joi = require("joi");

  const usrData = req.body;

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(255).required(),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/), //min 8 characters 1 letter 1 number
  });

  Joi.validate(usrData, schema, (err, value) => {
    if (err) {
      res.status(422).json({
        status: "Failed",
        message: "Invalid data",
        data: err,
      });
    } else {
      const { name, password, email } = usrData;

      hashPassword(password).then((hashed) => {
        const insertUserQuery = `INSERT INTO user (name, email, password) VALUES ("${name}", "${email}", "${hashed}");`;
        const fetchUserQuery = `SELECT user_id, name, email FROM user WHERE email = "${email}"`;

        connection.query(insertUserQuery, (err, result) => {
          if (err) {
            res.status(400).json({
              message: "Failed Something went wrong",
              error: err,
              user: null,
            });
          } else {
            connection.query(fetchUserQuery, (err, result) => {
              if (!err) {
                const { user_id, name, email } = result[0];
                const token = jwt.sign(
                  {
                    user_id,
                    name,
                    email,
                  },
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                res
                  .status(201)
                  .header("x-access-token", token)
                  .header("Access-Control-Expose-Headers", "x-access-token")
                  .send("Success user added");
              }
            });
          }
        });
      });
    }
  });
}
function filterByEmail(req, res) {
  const emailToFilter = req.params.email;
  const fetchUserQuery = `SELECT user_id, name, email FROM user WHERE email = "${emailToFilter}"`;

  connection.query(fetchUserQuery, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        message: "Email Found",
        user: result[0],
      });
    } else if (!err) {
      res.status(404).json({
        message: "Couldnt Find Such a user",
        user: null,
      });
    } else {
      res.status(400).json({
        message: "Error Something Went Wrong",
        user: null,
        error: err,
      });
    }
  });
}
function filterById(req, res) {
  const idToFilter = req.params.id;
  const fetchUserQuery = `SELECT user_id, name, email FROM user WHERE user_id = "${idToFilter}"`;

  connection.query(fetchUserQuery, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        message: "id Found",
        user: result[0],
      });
    } else if (!err) {
      res.status(404).json({
        message: "Couldnt Find Such a user",
        user: null,
      });
    } else {
      res.status(400).json({
        message: "Error Something Went Wrong",
        user: null,
        error: err,
      });
    }
  });
}
async function signUpToCourse(req, res) {
  let courseEnlist = req.body.subject;
  courseEnlist = courseEnlist.toLowerCase();
  let userId = req.body.user.user_id;

  console.log(userId);
  if (!courseEnlist || !userId) {
    res
      .status(400)
      .send("Error body must include a course to enlist to and a user");
  } else {
    const [subjects, validUser] = await Promise.all([
      getAllSubjects(),
      userExists(userId),
    ]);

    const onlySubjects = subjects[0].map((dict) => {
      return dict["subject"].toLowerCase();
    });

    if (!validUser || !onlySubjects.includes(courseEnlist)) {
      res.status(404).send("No such subject or userId found");
    } else {
      let subjectId = subjects[0].filter((s) => {
        return s.subject.toLowerCase() === courseEnlist;
      });

      subjectId = subjectId[0].subject_id;
      const toAddData = connection
        .query(
          `
            SELECT
                DISTINCT name,
                occupied FROM courses
            WHERE subject_id = ${subjectId}
	        ORDER BY
                occupied DESC`
        )
        .then((orderedCourses) => {
          const ordered = orderedCourses[0];
          let courseName;
          let studentCount;
          if (ordered.length === 0) {
            console.log("Opening course");
            courseName = `${courseEnlist} 1`;
            studentCount = 1;
          } else {
            console.log("Check Vacant place from previous course");
            let found = false;
            ordered.forEach((course, index) => {
              console.log(`course ${index}`);
              if (course.occupied < MAX_USERS_PER_COURSE && !found) {
                console.log("Found vacant place");
                courseName = course.name;
                studentCount = course.occupied + 1;
                found = true;
              } else if (index === ordered.length - 1 && !found) {
                console.log(`no place found opening new Course`);
                courseName = `${courseEnlist} ${index + 2}`;
                studentCount = 1;
              }
            });
          }
          return [courseName, studentCount];
        });

      toAddData.then(([courseName, studentCount]) => {
        connection
          .query(
            `
                INSERT INTO courses(name, subject_id, user_id, occupied)
                VALUES("${courseName}", ${subjectId}, ${userId},${studentCount})
            `
          )
          .then(() => {
            res.send("Success added user");
            updateCourseOccupied(courseName, studentCount);
          })
          .catch((err) => {
            res.status(400).json({
              message: "Error something went wrong when adding the user",
              error: err,
            });
          });
      });
    }
  }
}
function deleteUserFromCourse(req, res) {
  const { subject_id } = req.body;
  const user_id = req.body.user.user_id;
  if (!user_id || !subject_id) {
    res.status(400).send("Both user_id and subject_id fields are required");
  } else {
    const fetchCourseName = `
        SELECT name, occupied FROM courses
        WHERE 
            user_id = ${user_id} AND
            subject_id = ${subject_id}
        `;
    connection.query(fetchCourseName).then((nameQuery) => {
      const courseName = nameQuery[0][0].name;
      const { occupied } = nameQuery[0][0];
      const deleteCourseQuery = `
    DELETE FROM courses
      WHERE
          user_id = ${user_id} AND
          name = "${courseName}"`;

      connection
        .query(deleteCourseQuery)
        .then((result) => {
          if (result[0].affectedRows === 0) {
            res
              .status(218)
              .send("No such user or subject found no changes made to DB");
          } else {
            updateCourseOccupied(courseName, occupied - 1);
            res.status(200).json({
              message: "Successfully removed user from course",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error something went wrong",
            error: err,
          });
        });
    });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All fields required");
    }

    connection
      .query(
        `
    SELECT * FROM user
    WHERE email = "${email}"`
      )
      .then(async (queryResult) => {
        const userData = queryResult[0][0];
        if (!userData) {
          res.status(401).send("Invalid Credentials");
        } else {
          if (await bcrypt.compare(password, userData.password)) {
            const token = jwt.sign(
              {
                user_id: userData.user_id,
                name: userData.name,
                email: userData.email,
              },
              process.env.TOKEN_KEY,
              {
                expiresIn: "1h",
              }
            );

            res
              .status(200)
              .header("x-access-token", token)
              .header("Access-Control-Expose-Headers", "x-access-token")
              .send("Welcome User");
          } else {
            res.status(401).send("Invalid Credentials");
          }
        }
      });
  } catch (err) {
    console.log(err);
  }
}
async function fetchUnlistedCourses(req, res) {
  const query = `
  SELECT subject_id From courses
  WHERE user_id = ${req.body.user.user_id}`;

  let [userSubjects, allSubjects] = await Promise.all([
    connection.query(query),
    getAllSubjects(),
  ]);

  userSubjects = userSubjects[0].map((sub) => {
    return sub.subject_id;
  });

  const unlistedSubjects = allSubjects[0].filter((subject) => {
    return !userSubjects.includes(subject.subject_id);
  });

  res.send(unlistedSubjects);
}
async function fetchLitedCourses(req, res) {
  const query = `
  SELECT * From courses
  WHERE user_id = ${req.body.user.user_id}`;

  const listedCourses = await connection.query(query);

  res.send(listedCourses[0]);
}
async function resetPassword(req, res) {
  try {
    const { new_password, old_password } = req.body;
    const { user } = req.body;

    if (!(new_password && old_password)) {
      res.status(400).send("All fields required");
    }

    connection
      .query(
        `SELECT * FROM user
          WHERE email = "${user.email}"`
      )
      .then(async (queryResult) => {
        const userData = queryResult[0][0];
        if (!userData) {
          res.status(401).send("Invalid Credentials");
        } else {
          if (await bcrypt.compare(old_password, userData.password)) {
            hashPassword(new_password)
              .then((hashedPass) => {
                const updateQuery = `
                UPDATE user
                SET password = "${hashedPass}"
                WHERE user_id = ${user.user_id}
              `;

                return connection.query(updateQuery);
              })
              .then(() => {
                res.status(200).send("New Password Set for User");
              })
              .catch((err) =>
                res.status(400).json({ error: err, msg: "error" })
              );
          } else {
            res.status(401).send("Invalid Credentials");
          }
        }
      });
  } catch (err) {
    console.log(err);
  }
}
//-----------------------HELPER FUNCTIONS----------------------------

async function getAllSubjects() {
  const getSubjecsQuery = "SELECT * FROM subject";
  subjects = await connection.query(getSubjecsQuery);

  return subjects;
}

async function getAllSubjectsDetailed() {
  const getSubjecsQuery = "SELECT * FROM subject";
  subjects = await connection.query(getSubjecsQuery);

  return subjects;
}

async function userExists(uid) {
  const fetchUserQuery = `SELECT user_id, name, email FROM user WHERE user_id = "${uid}"`;

  user = await connection.query(fetchUserQuery);
  //   console.log(`${uid} exists? ${user}`);
  return user[0].length > 0;
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}
module.exports = {
  addUser,
  filterByEmail,
  filterById,
  signUpToCourse,
  deleteUserFromCourse,
  login,
  getAllSubjectsDetailed,
  fetchUnlistedCourses,
  fetchLitedCourses,
  resetPassword,
};

function updateCourseOccupied(courseName, newOcc) {
  const updateOccupiedQuery = `
        UPDATE courses
        set occupied = ${newOcc}
        WHERE name = "${courseName}"
    `;

  connection.query(updateOccupiedQuery);
}
