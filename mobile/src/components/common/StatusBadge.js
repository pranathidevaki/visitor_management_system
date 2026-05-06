import { View, Text, StyleSheet } from 'react-native'

const StatusBadge = ({ status }) => {

  const colors = {
    pending:   { bg: '#422006', text: '#fbbf24' },
    approved:  { bg: '#052e16', text: '#4ade80' },
    rejected:  { bg: '#450a0a', text: '#f87171' },
    cancelled: { bg: '#111827', text: '#9ca3af' },
  }

  const color = colors[status] || colors.pending

  return (
    <View style={[styles.badge, { backgroundColor: color.bg }]}>
      <Text style={[styles.text, { color: color.text }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  }
})

export default StatusBadge