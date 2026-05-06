// api.js
// This is the single connection point to your backend
// Every service file imports from here
// 
// Why? If your backend URL ever changes
// you change it in ONE place, not everywhere

import axios from 'axios'

const api = axios.create({
  baseURL: 'https://visitor-management-system-api-sg8f.onrender.com',
  // this is where your backend is running
})

// This is called an interceptor
// It runs BEFORE every single request
// Its job is to attach the token automatically
// so you don't have to do it manually every time
api.interceptors.request.use((config) => {

  // Get the token from localStorage
  // localStorage is like a small storage box
  // in the browser that remembers things
  // even after you refresh the page
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // automatically adds the token to every request
  }

  return config
})

// This interceptor runs on every RESPONSE
// If the backend says 401 (unauthorized)
// it means the token expired
// so we log the user out automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      // send them back to login
    }
    return Promise.reject(error)
  }
)

export default api