import { useState } from 'react'
import { 
  View, Text, StyleSheet, 
  Alert,
  KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuthStore()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      if (user.role === 'admin') {
        Alert.alert(
          'Wrong App', 
          'Admins should use the web dashboard'
        )
        return
      }

      await login(user, token)

    } catch (err) {
      Alert.alert(
        'Login Failed',
        err.response?.data?.error || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.logo}>🏢</Text>
          <Text style={styles.title}>Visitor Management System</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <Button
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  form: {
    gap: 4,
  },
  loginButton: {
    marginTop: 8,
  }
})

export default LoginScreen