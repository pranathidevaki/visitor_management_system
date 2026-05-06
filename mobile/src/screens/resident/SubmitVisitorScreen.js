import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  Alert, TouchableOpacity
} from 'react-native'
import visitorService from '../../services/visitorService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const SubmitVisitorScreen = () => {

  const [form, setForm] = useState({
    full_name: '',
    id_number: '',
    phone: '',
    reason: '',
    building_id: '',
    visitor_type_id: '',
  })

  const [buildings, setBuildings] = useState([])
  const [visitorTypes, setVisitorTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchDropdownData()
  }, [])

  const fetchDropdownData = async () => {
    try {
      setLoading(true)
      const [buildingsData, typesData] = await Promise.all([
        visitorService.getBuildings(),
        visitorService.getVisitorTypes()
      ])
      setBuildings(buildingsData)
      setVisitorTypes(typesData)
    } catch (err) {
      Alert.alert('Error', 'Failed to load form data')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.full_name || !form.id_number || !form.building_id) {
      Alert.alert('Error', 'Please fill in name, ID number and select a building')
      return
    }

    try {
      setSubmitting(true)
      await visitorService.submit(form)
      setSuccess(true)
      // Reset form
      setForm({
        full_name: '',
        id_number: '',
        phone: '',
        reason: '',
        building_id: '',
        visitor_type_id: '',
      })
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to submit visitor')
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Visitor Submitted!</Text>
        <Text style={styles.successSub}>
          Your visitor request has been sent for approval.
          You'll be notified once it's reviewed.
        </Text>
        <Button
          title="Submit Another"
          onPress={() => setSuccess(false)}
          style={styles.successButton}
        />
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading form...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}
                contentContainerStyle={styles.content}>

      <Text style={styles.title}>Submit Visitor</Text>
      <Text style={styles.subtitle}>
        Fill in your visitor's details for approval
      </Text>

      {/* Visitor Name */}
      <Input
        label="Full Name *"
        value={form.full_name}
        onChangeText={(val) => updateForm('full_name', val)}
        placeholder="John Smith"
      />

      {/* ID Number */}
      <Input
        label="ID / Passport Number *"
        value={form.id_number}
        onChangeText={(val) => updateForm('id_number', val)}
        placeholder="A12345678"
      />

      {/* Phone */}
      <Input
        label="Phone Number"
        value={form.phone}
        onChangeText={(val) => updateForm('phone', val)}
        placeholder="+971501234567"
        keyboardType="phone-pad"
      />

      {/* Reason */}
      <Input
        label="Reason for Visit"
        value={form.reason}
        onChangeText={(val) => updateForm('reason', val)}
        placeholder="Family visit, business meeting etc"
      />

      {/* Building Selector */}
      <Text style={styles.label}>Select Building *</Text>
      <View style={styles.optionsContainer}>
        {buildings.map((building) => (
          <TouchableOpacity
            key={building.id}
            style={[
              styles.optionButton,
              form.building_id === building.id && styles.optionSelected
            ]}
            onPress={() => updateForm('building_id', building.id)}
          >
            <Text style={[
              styles.optionText,
              form.building_id === building.id && styles.optionTextSelected
            ]}>
              🏢 {building.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Visitor Type Selector */}
      <Text style={styles.label}>Visitor Type</Text>
      <View style={styles.optionsContainer}>
        {visitorTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.optionButton,
              form.visitor_type_id === type.id && styles.optionSelected
            ]}
            onPress={() => updateForm('visitor_type_id', type.id)}
          >
            <Text style={[
              styles.optionText,
              form.visitor_type_id === type.id && styles.optionTextSelected
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <Button
        title="Submit Visitor Request"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.submitButton}
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 32,
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: '#581c87',
    borderColor: '#9333ea',
  },
  optionText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successSub: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButton: {
    width: '100%',
  }
})

export default SubmitVisitorScreen