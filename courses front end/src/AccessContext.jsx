import React, { useContext, useState } from 'react'

const AccessContext = React.createContext()
const AccessUpdateContext = React.createContext()

export function useAccess() {
  return useContext(AccessContext)
}

export function useAccessUpdate() {
  return useContext(AccessUpdateContext)
}

export function AccessProvider({ children }) {
  // this hook was taken from usehooks.com/useLocalStorage/
  function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === 'undefined') {
        return initialValue
      }
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key)
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue
      } catch (error) {
        // If error also return initialValue
        console.log(error)
        return initialValue
      }
    })
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        // Save state
        setStoredValue(valueToStore)
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error)
      }
    }
    return [storedValue, setValue]
  }

  const [tokenVal, setTokenVal] = useLocalStorage(
    'access-token',
    'EMPTY_TOKEN_NO_USER_LOGGED_IN'
  )

  return (
    <AccessUpdateContext.Provider value={setTokenVal}>
      <AccessContext.Provider value={tokenVal}>
        {children}
      </AccessContext.Provider>
    </AccessUpdateContext.Provider>
  )
}
