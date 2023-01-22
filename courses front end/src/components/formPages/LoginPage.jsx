import './style.css'
import LoginForm from './LoginForm'
import { useAccess, useAccessUpdate } from '../../AccessContext'
import jwt from 'jwt-decode'

function loginPage() {
  const token = useAccess()
  const updateToken = useAccessUpdate()
  return (
    <div id="main-content">
      {token === 'EMPTY_TOKEN_NO_USER_LOGGED_IN' ? (
        <h1 className="header">Hello Student Please Log In</h1>
      ) : (
        <h1 className="header">{jwt(token).name} is already logged in</h1>
      )}
      {token === 'EMPTY_TOKEN_NO_USER_LOGGED_IN' && <LoginForm />}
    </div>
  )
}

export default loginPage
