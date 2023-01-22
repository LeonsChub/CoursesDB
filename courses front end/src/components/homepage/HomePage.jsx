import React from 'react'
import './style.css'

import { useAccess } from '../../AccessContext'
import UnloggedPage from './UnloggedPage'
import LoggedPage from './LoggedPage'
function HomePage() {
  const tokenVal = useAccess()
  return tokenVal === 'EMPTY_TOKEN_NO_USER_LOGGED_IN' ? (
    <UnloggedPage />
  ) : (
    <LoggedPage />
  )
}

export default HomePage
