import { useFormik } from 'formik'
import axios from 'axios'
import { useState } from 'react'
import { useAccessUpdate } from '../../AccessContext'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const [errors, setErrors] = useState('')
  const updateToken = useAccessUpdate()
  const navigate = useNavigate()

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: (values) => {
      const { email, password } = values
      if (!email || !password) {
        setErrors('Please provide actual login information')
      } else {
        postDataToServer(email, password)
      }
    },
  })

  function postDataToServer(email, pass) {
    axios
      .post('http://localhost:3000/users/login', {
        email: email,
        password: pass,
      })
      .then((resp) => {
        updateToken(resp.headers['x-access-token'])
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status === 401) {
          setErrors('Error Invalid Credentials Entered')
        }
      })
  }

  return (
    <form className="lim_w" onSubmit={handleSubmit}>
      <span className="inputField">
        <label className="input_label" htmlFor="user_email">
          Email:
        </label>
        <input
          type="text"
          name="email"
          id="user_email"
          value={values.email}
          onChange={handleChange}
        />
      </span>

      <span className="inputField">
        <label className="input_label" htmlFor="user_password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="user_password"
          values={values.password}
          onChange={handleChange}
        />
      </span>

      <span className="inputField">
        <span className="error">{!errors ? `` : errors} &nbsp;</span>
      </span>

      <span className="inputField">
        <button type="submit">Log In</button>
      </span>
    </form>
  )
}

export default LoginForm

// function validateData(values) {
//   const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/
//   const passwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //8 Letters 1 number 1 Capital letter
//   console.log(emailRegex.test(values.email))
//   console.log(passwRegex.test(values.Wo))
// }
