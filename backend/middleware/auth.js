const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("No Token Recieved");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
