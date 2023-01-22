import './style.css'
import { useAccess, useAccessUpdate } from '../../AccessContext'
import jwt from 'jwt-decode'
import ResetForm from './ResetForm'

function ResetPage() {
  const token = useAccess()
  const updateToken = useAccessUpdate()
  return (
    <div id="main-content">
      {token !== 'EMPTY_TOKEN_NO_USER_LOGGED_IN' ? (
        <h1 className="header">
          {jwt(token).name} are you sure you want to reset your password?
        </h1>
      ) : (
        <h1 className="header">No user logged In</h1>
      )}
      {token !== 'EMPTY_TOKEN_NO_USER_LOGGED_IN' && <ResetForm />}
    </div>
  )
}

export default ResetPage
