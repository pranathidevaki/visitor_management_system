import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import useAuthStore from '../../store/authStore'

const GuardHomeScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Guard Panel 💂</Text>
      <Text style={styles.name}>{user?.full_name}</Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('SearchVisitor')}
      >
        <Text style={styles.searchText}>🔍 Search Visitor</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    color: '#9ca3af',
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 32,
  },
  searchButton: {
    backgroundColor: '#9333ea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logout: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
})

export default GuardHomeScreen