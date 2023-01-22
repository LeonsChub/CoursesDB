import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import axios from 'axios'
import { useAccess } from '../../../AccessContext'

function SubjectItem({ subjectInfo }) {
  const [prompted, setPrompted] = useState(false)
  const navigate = useNavigate()
  const tokenVal = useAccess()

  async function postDataToServer(subjectName) {
    axios.post('http://localhost:3000/users/course-sign-up', {
      token: tokenVal,
      subject: subjectName,
    })
  }

  return (
    <div className="subjectCard" id={subjectInfo.subject}>
      <div className="cardHeader">
        <h3>{subjectInfo.subject}</h3>

        <p>Rating: {subjectInfo.rating}/5.0</p>
      </div>
      <div className="cardBody">
        <div className="imgWrap">
          <img src={`SubjectImages/${subjectInfo.subject}.png`} alt="" />
        </div>
        <div className="textWrap">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
            dolorum laborum, laboriosam distinctio minus dolor inventore quasi
            et vel. Vitae!
          </p>

          <div className="extraWrap">
            <p className="level">Level: {subjectInfo.level}</p>
            {!prompted ? (
              <button onClick={() => setPrompted(true)} className="signUpBtn">
                Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setPrompted(false)
                  postDataToServer(subjectInfo.subject)
                  navigate('/myCourses')
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

export default SubjectItem
