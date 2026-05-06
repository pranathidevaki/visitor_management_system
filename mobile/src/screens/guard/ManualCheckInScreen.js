import { useState } from 'react'
import {
  View, Text, StyleSheet,
  ScrollView, Alert
} from 'react-native'
import api from '../../services/api'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const ManualCheckInScreen = ({ navigation, route }) => {

  const { idNumber } = route.params || {}

  const [form, setForm] = useState({
    full_name: '',
    id_number: idNumber || '',
    phone: '',
    reason: '',
    building_id: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
  if (!form.full_name || !form.id_number) {
    Alert.alert('Error', 'Name and ID number are required')
    return
  }

  try {
    setSubmitting(true)

    await api.post('/visitors/manual', {
      full_name: form.full_name,
      id_number: form.id_number,
      phone: form.phone || null,
      reason: form.reason || null,
      building_id: form.building_id || null,
      // null instead of empty string ""
      // Supabase accepts null for uuid fields
      // but rejects empty string ""
      status: 'approved',
    })

    navigation.navigate('CheckInSuccess', {
      visitorName: form.full_name
    })

  } catch (err) {
    Alert.alert(
      'Error',
      err.response?.data?.error || 'Failed to register visitor'
    )
  } finally {
    setSubmitting(false)
  }
}

  return (
    <ScrollView style={styles.container}
                contentContainerStyle={styles.content}>

      <Text style={styles.title}>Manual Check In</Text>
      <Text style={styles.subtitle}>
        Register a visitor who is not in the system
      </Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Only use this for visitors who are not
          pre-registered. All entries are logged.
        </Text>
      </View>

      <Input
        label="Full Name *"
        value={form.full_name}
        onChangeText={(val) => updateForm('full_name', val)}
        placeholder="John Smith"
      />

      <Input
        label="ID / Passport Number *"
        value={form.id_number}
        onChangeText={(val) => updateForm('id_number', val)}
        placeholder="A12345678"
      />

      <Input
        label="Phone Number"
        value={form.phone}
        onChangeText={(val) => updateForm('phone', val)}
        placeholder="+971501234567"
        keyboardType="phone-pad"
      />

      <Input
        label="Reason for Visit"
        value={form.reason}
        onChangeText={(val) => updateForm('reason', val)}
        placeholder="Delivery, maintenance etc"
      />

      <Button
        title="Register & Check In"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.submitButton}
      />

      <Button
        title="Cancel"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
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
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#422006',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#92400e',
  },
  warningText: {
    color: '#fbbf24',
    fontSize: 13,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  }
})

export default ManualCheckInScreen