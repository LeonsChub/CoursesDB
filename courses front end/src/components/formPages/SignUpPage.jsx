import './style.css'
import SignUpForm from './SignUpForm'
import { useAccess, useAccessUpdate } from '../../AccessContext'
import jwt from 'jwt-decode'

function SignUpPage() {
  const token = useAccess()
  const updateToken = useAccessUpdate()
  return (
    <div id="main-content">
      {token === 'EMPTY_TOKEN_NO_USER_LOGGED_IN' ? (
        <h1 className="header">
          Welcome To ORPrebyc Sign up to start your journey
        </h1>
      ) : (
        <h1 className="header">{jwt(token).name} is already logged in</h1>
      )}
      {token === 'EMPTY_TOKEN_NO_USER_LOGGED_IN' && <SignUpForm />}
    </div>
  )
}

export default SignUpPage
