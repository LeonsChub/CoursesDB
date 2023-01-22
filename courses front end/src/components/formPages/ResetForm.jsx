import { useFormik } from 'formik'
import axios from 'axios'
import { useState } from 'react'
import { useAccess, useAccessUpdate } from '../../AccessContext'

function ResetForm() {
  const [errors, setErrors] = useState({
    passMismatch: undefined,
    weakPassword: undefined,
    allFields: undefined,
    invalidPass: undefined,
  })

  function postDataToServer() {
    axios
      .put('http://localhost:3000/users/reset-password', {
        token: tokenVal,
        old_password: values.oldPass,
        new_password: values.newPass1,
      })
      .then((resp) => {
        console.log(resp)
      })
      .catch((err) => {
        console.log(err)
        if (err['response'].status === 401) {
          setErrors((prev) => {
            const oldState = prev
            oldState.invalidPass = 'Wrong password'

            return oldState
          })
        }
        console.log(err)
      })
  }

  const tokenVal = useAccess()

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      oldPass: '',
      newPass1: '',
      newPass2: '',
    },
    onSubmit: () => {
      const errors = validateData(values)
      setErrors(errors)

      if (!errors.passMismatch && !errors.weakPassword && !errors.allFields) {
        postDataToServer()
      }
    },
  })

  return (
    <form className="lim_w" onSubmit={handleSubmit}>
      <span className="inputField">
        <label className="input_label" htmlFor="user_email">
          Old Password:
        </label>
        <input
          type="password"
          name="oldPass"
          id="old_passwd"
          value={values.oldPass}
          onChange={handleChange}
        />
      </span>

      {renderError(errors.invalidPass)}

      <span className="inputField">
        <label className="input_label" htmlFor="user_email">
          New Password:
        </label>
        <input
          type="password"
          name="newPass1"
          id="new_pass1"
          value={values.newPass1}
          onChange={handleChange}
        />
      </span>

      {renderError(errors.weakPassword)}

      <span className="inputField">
        <label className="input_label" htmlFor="user_password">
          Retype Password:
        </label>
        <input
          type="password"
          name="newPass2"
          id="user_password"
          values={values.newPass2}
          onChange={handleChange}
        />
      </span>

      {renderError(errors.passMismatch)}

      {renderError(errors.allFields)}

      <span className="inputField">
        <button type="submit">Sign Up</button>
      </span>
    </form>
  )
}

export default ResetForm

function validateData(values) {
  const toReturn = {
    passMismatch: undefined,
    weakPassword: undefined,
    allFields: undefined,
    invalidPass: undefined,
  }
  const passwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //8 Letters 1 number 1 Capital letter

  if (!values.oldPass || !values.newPass1 || !values.newPass2) {
    toReturn.allFields = 'Make sure all fields are properly filled out'
  } else {
    toReturn.weakPassword = !passwRegex.test(values.newPass1)
      ? 'Weak password make sure it contains at least 8 letters 1 capital and one number'
      : undefined
    toReturn.passMismatch =
      values.newPass1 !== values.newPass2
        ? 'New Password Does not match'
        : undefined
  }

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
