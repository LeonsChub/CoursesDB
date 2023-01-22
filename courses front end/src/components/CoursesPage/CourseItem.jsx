import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import axios from 'axios'
import { useAccess } from '../../AccessContext'
function CourseItem({ subjectInfo }) {
  const [prompted, setPrompted] = useState(false)
  const navigate = useNavigate()
  const tokenVal = useAccess()
  let picturePath = subjectInfo.name.split(' ')[0]
  picturePath = picturePath.charAt(0).toUpperCase() + picturePath.slice(1)
  switch (picturePath) {
    case 'Mongodb':
      picturePath = 'MongoDB'
      break

    case 'Sql':
      picturePath = 'SQL'
      break

    case 'Javascript':
      picturePath = 'JavaScript'
  }

  async function postDataToServer(subjectId) {
    axios.delete('http://localhost:3000/users/remove-user-from-course', {
      headers: {
        'x-access-token': tokenVal,
      },
      data: {
        subject_id: subjectId,
      },
    })
  }
  return (
    <div className="subjectCard" id={subjectInfo.name}>
      <div className="cardHeader">
        <h3>{subjectInfo.name}</h3>
      </div>
      <div className="cardBody">
        <div className="imgWrap">
          <img src={`SubjectImages/${picturePath}.png`} alt="" />
        </div>
        <div className="textWrap">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
            dolorum laborum, laboriosam distinctio minus dolor inventore quasi
            et vel. Vitae!
          </p>

          <div className="extraWrap">
            <p className="level">Capacity: {subjectInfo.occupied}</p>
            {!prompted ? (
              <button onClick={() => setPrompted(true)} className="signUpBtn">
                Delete
              </button>
            ) : (
              <button
                onClick={() => {
                  setPrompted(false)
                  postDataToServer(subjectInfo.subject_id)
                  navigate('/')
                }}
                className="signUpBtn"
              >
                You Sure?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseItem
