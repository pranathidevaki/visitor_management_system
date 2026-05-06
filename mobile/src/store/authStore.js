import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const userString = await AsyncStorage.getItem('user')
      if (token && userString) {
        const user = JSON.parse(userString)
        set({ user, token, isAuthenticated: true })
      }
    } catch (error) {
      console.log('Error loading auth:', error)
    }
  },

  login: async (user, token) => {
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  }
}))

export default useAuthStore