import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import HomeScreen from '../screens/resident/HomeScreen'
import SubmitVisitorScreen from '../screens/resident/SubmitVisitorScreen'
import ManageVisitorsScreen from '../screens/resident/ManageVisitorsScreen'
import NotificationsScreen from '../screens/resident/NotificationsScreen'

const Tab = createBottomTabNavigator()

const ResidentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#374151',
          paddingBottom: 25,
          paddingTop: 8,
          height: 105,
        },
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Submit"
        component={SubmitVisitorScreen}
        options={{
          tabBarLabel: 'Submit Visitor',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>➕</Text>,
        }}
      />
      <Tab.Screen
        name="MyVisitors"
        component={ManageVisitorsScreen}
        options={{
          tabBarLabel: 'My Visitors',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔔</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

export default ResidentNavigator