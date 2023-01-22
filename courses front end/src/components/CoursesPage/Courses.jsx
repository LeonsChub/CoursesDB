import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useAccess } from '../../AccessContext'
import jwt from 'jwt-decode'
import { useState } from 'react'
import CourseItem from './CourseItem'
function Courses() {
  const tokenVal = useAccess()
  const [subjects, setSubjects] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:3000/users/get-enlisted-courses', {
        headers: {
          'x-access-token': tokenVal,
        },
      })
      .then((result) => setSubjects(result['data']))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div>
      <div id="fullSpanBanner">
        <h2 className="user-greeting">
          {tokenVal !== 'EMPTY_TOKEN_NO_USER_LOGGED_IN'
            ? `Welcome ${jwt(tokenVal).name}`
            : ''}
        </h2>

        <p>Here are your available courses</p>
      </div>

      {subjects.map((sub) => {
        return <CourseItem key={sub.subject_id} subjectInfo={sub} />
      })}
    </div>
  )
}

export default Courses
