import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  Alert, TouchableOpacity
} from 'react-native'
import visitorService from '../../services/visitorService'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'

const VisitorFoundScreen = ({ navigation, route }) => {

  // Get the visitor passed from SearchVisitorScreen
  const { visitor } = route.params
  const [loading, setLoading] = useState(false)

  const handleCheckIn = async () => {
    Alert.alert(
      'Confirm Check In',
      `Check in ${visitor.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check In',
          onPress: async () => {
            try {
              setLoading(true)
              await visitorService.checkIn(visitor.id)
              navigation.navigate('CheckInSuccess', {
                visitorName: visitor.full_name
              })
            } catch (err) {
              Alert.alert(
                'Error',
                err.response?.data?.error || 'Check in failed'
              )
            } finally {
              setLoading(false)
            }
          }
        }
      ]
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ScrollView style={styles.container}
                contentContainerStyle={styles.content}>

      {/* Status banner */}
      <View style={[
        styles.statusBanner,
        visitor.status === 'approved'
          ? styles.statusApproved
          : styles.statusRejected
      ]}>
        <Text style={styles.statusIcon}>
          {visitor.status === 'approved' ? '✅' : '❌'}
        </Text>
        <Text style={styles.statusText}>
          {visitor.status === 'approved'
            ? 'APPROVED — Clear to enter'
            : 'NOT APPROVED — Do not allow entry'}
        </Text>
      </View>

      {/* Visitor details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {[
          { label: 'Full Name',  value: visitor.full_name  },
          { label: 'ID Number',  value: visitor.id_number  },
          { label: 'Phone',      value: visitor.phone || '—' },
        ].map((item) => (
          <View key={item.label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Visit Information</Text>

        {[
          { label: 'Reason',     value: visitor.reason || '—'   },
          { label: 'Type',       value: visitor.visitor_types?.name || '—' },
          { label: 'Visit Date', value: formatDate(visitor.visit_date) },
          { label: 'Status',     value: visitor.status },
        ].map((item) => (
          <View key={item.label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Resident info */}
      {visitor.users && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Invited By</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Resident</Text>
            <Text style={styles.detailValue}>
              {visitor.users.full_name}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>
              {visitor.users.phone || '—'}
            </Text>
          </View>
        </View>
      )}

      {/* Check in button - only show if approved */}
      {visitor.status === 'approved' && (
        <Button
          title="✓ Check In Visitor"
          onPress={handleCheckIn}
          loading={loading}
          variant="success"
          style={styles.checkInButton}
        />
      )}

      {/* Go back button */}
      <Button
        title="Search Again"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.backButton}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  statusBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusApproved: {
    backgroundColor: '#052e16',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  statusRejected: {
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  statusIcon: {
    fontSize: 24,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  checkInButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 4,
  }
})

export default VisitorFoundScreen