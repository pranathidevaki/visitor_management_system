import { View, Text, StyleSheet } from 'react-native'

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827',
               padding: 24, paddingTop: 60 },
  text: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sub: { color: '#6b7280', marginTop: 8 }
})

export default NotificationsScreen