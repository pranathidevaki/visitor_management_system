import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import useAuthStore from '../store/authStore'
import LoginScreen from '../screens/auth/LoginScreen'
import ResidentNavigator from './ResidentNavigator'
import GuardNavigator from './GuardNavigator'

const Stack = createStackNavigator()

const AppNavigator = () => {
  // Use selector pattern instead of destructuring
  // This way component only re-renders when that
  // specific value changes, not on any store change
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user?.role === 'guard' ? (
          <Stack.Screen name="Guard" component={GuardNavigator} />
        ) : (
          <Stack.Screen name="Resident" component={ResidentNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator