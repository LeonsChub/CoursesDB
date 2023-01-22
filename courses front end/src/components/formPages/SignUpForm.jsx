import { useFormik } from 'formik'
import axios from 'axios'
import { useState } from 'react'
import { useAccessUpdate } from '../../AccessContext'

function SignUpForm() {
  const [errors, setErrors] = useState({
    name_error: undefined,
    email_error: undefined,
    pass_error: undefined,
  })

  const setTokenVal = useAccessUpdate()

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: () => {
      const errors = validateData(values)
      setErrors(errors)

      if (!errors.name_error && !errors.pass_error && !errors.email_error) {
        postDataToServer(values, setTokenVal, setErrors)
      }
    },
  })

  return (
    <form className="lim_w" onSubmit={handleSubmit}>
      <span className="inputField">
        <label className="input_label" htmlFor="user_email">
          Name:
        </label>
        <input
          type="text"
          name="name"
          id="user_name"
          value={values.name}
          onChange={handleChange}
        />
      </span>
      {renderError(errors.name_error)}

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
      {renderError(errors.email_error)}

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

      {renderError(errors.pass_error)}

      <span className="inputField">
        <button type="submit">Sign Up</button>
      </span>
    </form>
  )
}

export default SignUpForm

function validateData(values) {
  const toReturn = {
    name_error: undefined,
    email_error: undefined,
    pass_error: undefined,
  }
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/
  const passwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //8 Letters 1 number 1 Capital letter
  toReturn.email_error = !emailRegex.test(values.email)
    ? 'Please Enter a valid Email adress'
    : ''
  toReturn.pass_error = !passwRegex.test(values.password)
    ? 'Weak password make sure it contains at least 8 letters 1 capital and one number'
    : ''
  toReturn.name_error =
    values.name.trim().length < 3
      ? 'Name should contain at least 3 letters'
      : ''

  return toReturn
}

function renderError(error) {
  if (error) {
    return (
      <span className="inputField">
        <span className="error"> {error}</span>
      </span>
    )
  } else {
    return undefined
  }
}

function postDataToServer(values, setTokenCb, errorCb) {
  axios
    .post('http://localhost:3000/users/new-user', {
      email: values.email,
      password: values.password,
      name: values.name,
    })
    .then((resp) => {
      setTokenCb(resp['headers']['x-access-token'])
    })
    .catch((err) => {
      if (err['response']['data']['error']['errno'] === 1062) {
        errorCb((prev) => {
          const oldState = { ...prev }
          oldState.email_error = 'Email already taken.'

          return oldState
        })
      } else {
        alert('Error check console')
        console.log(err)
      }
    })
}
