import { createStackNavigator } from '@react-navigation/stack'
import GuardHomeScreen from '../screens/guard/GuardHomeScreen'
import SearchVisitorScreen from '../screens/guard/SearchVisitorScreen'
import VisitorFoundScreen from '../screens/guard/VisitorFoundScreen'
import ManualCheckInScreen from '../screens/guard/ManualCheckInScreen'
import CheckInSuccessScreen from '../screens/guard/CheckInSuccessScreen'

const Stack = createStackNavigator()

const GuardNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1f2937' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: '#111827' },
      }}
    >
      <Stack.Screen
        name="GuardHome"
        component={GuardHomeScreen}
        options={{ title: 'Guard Panel' }}
      />
      <Stack.Screen
        name="SearchVisitor"
        component={SearchVisitorScreen}
        options={{ title: 'Search Visitor' }}
      />
      <Stack.Screen
        name="VisitorFound"
        component={VisitorFoundScreen}
        options={{ title: 'Visitor Details' }}
      />
      <Stack.Screen
        name="ManualCheckIn"
        component={ManualCheckInScreen}
        options={{ title: 'Manual Check In' }}
      />
      <Stack.Screen
        name="CheckInSuccess"
        component={CheckInSuccessScreen}
        options={{ title: 'Success', headerLeft: () => null }}
      />
    </Stack.Navigator>
  )
}

export default GuardNavigator