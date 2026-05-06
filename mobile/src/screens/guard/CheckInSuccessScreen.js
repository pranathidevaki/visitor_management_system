import { View, Text, StyleSheet } from 'react-native'
import Button from '../../components/common/Button'

const CheckInSuccessScreen = ({ navigation, route }) => {
  const { visitorName } = route.params || {}

  return (
    <View style={styles.container}>

      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Checked In!</Text>
      <Text style={styles.name}>{visitorName}</Text>
      <Text style={styles.subtitle}>
        has been successfully checked in.{'\n'}
        A notification has been sent to the resident.
      </Text>

      <Button
        title="Check In Another Visitor"
        onPress={() => navigation.navigate('SearchVisitor')}
        style={styles.button}
      />

      <Button
        title="Back to Guard Home"
        variant="secondary"
        onPress={() => navigation.navigate('GuardHome')}
        style={styles.button}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  name: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  }
})

export default CheckInSuccessScreen