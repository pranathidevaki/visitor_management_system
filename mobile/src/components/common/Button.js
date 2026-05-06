import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false,
  style
}) => {

  const variantStyles = {
    primary:   styles.primary,
    danger:    styles.danger,
    secondary: styles.secondary,
    success:   styles.success,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variantStyles[variant],
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary:   { backgroundColor: '#9333ea' },
  danger:    { backgroundColor: '#dc2626' },
  secondary: { backgroundColor: '#374151' },
  success:   { backgroundColor: '#16a34a' },
  disabled:  { opacity: 0.5 },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
})

export default Button