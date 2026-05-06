// authStore.js
// This is the global whiteboard that remembers
// who is currently logged in
//
// Any component in the entire app can read from
// or write to this store
//
// We're using Zustand which is the simplest
// way to do this in React

import { create } from 'zustand'

const useAuthStore = create((set) => ({

  // Initial state
  // When the app loads, check localStorage
  // in case the user was already logged in
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  // !! converts anything to true or false
  // if token exists → true
  // if token is null → false

  // LOGIN action
  // Called after successful login
  // saves everything to state AND localStorage
  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  // LOGOUT action
  // Clears everything
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  }

}))

export default useAuthStore