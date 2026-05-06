import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import useAuthStore from '../store/authStore'
import LoginScreen from '../screens/auth/LoginScreen'
import ResidentNavigator from './ResidentNavigator'
import GuardNavigator from './GuardNavigator'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth)

  // Loading state prevents the app from
  // flickering between login and home screen
  // while it checks AsyncStorage
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const prepare = async () => {
      await loadStoredAuth()
      setIsLoading(false)
    }
    prepare()
  }, [])

  // Show a blank loading screen while
  // checking if user is already logged in
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ActivityIndicator color="#9333ea" size="large" />
      </View>
    )
  }

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