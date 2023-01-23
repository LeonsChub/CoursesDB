import './navbar.css'
import { Link } from 'react-router-dom'
import { useAccess, useAccessUpdate } from '../../AccessContext'
import { useNavigate } from 'react-router-dom'
function Navbar() {
  const tokenVal = useAccess()
  const setTokenVal = useAccessUpdate()
  const navigate = useNavigate()

  const unloggedBtns = () => {
    return (
      <>
        <Link to="signup">
          <button>Sign-Up</button>
        </Link>
        <Link to="login">
          <button>Log-in</button>
        </Link>
      </>
    )
  }

  const loggedinBtns = () => {
    return (
      <>
        <button
          onClick={() => {
            setTokenVal('EMPTY_TOKEN_NO_USER_LOGGED_IN')
            navigate('/')
          }}
        >
          Log-out
        </button>

        <Link to="myCourses">
          <button>My Courses</button>
        </Link>
        <Link to="passwordReset">
          <button>Reset Password</button>
        </Link>
      </>
    )
  }

  return (
    <div id="navbar">
      <ul className="horizontal">
        <Link to="/">
          <h1 className="brand">ORPrebyc</h1>
        </Link>
      </ul>
      <ul className="links-wrap">
        {tokenVal !== 'EMPTY_TOKEN_NO_USER_LOGGED_IN'
          ? loggedinBtns()
          : unloggedBtns()}
      </ul>
    </div>
  )
}

export default Navbar
