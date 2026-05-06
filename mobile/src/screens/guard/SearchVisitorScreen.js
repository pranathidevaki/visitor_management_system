import { useState } from 'react'
import {
  View, Text, StyleSheet, Alert,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import visitorService from '../../services/visitorService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'

const SearchVisitorScreen = ({ navigation }) => {

  const [idNumber, setIdNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  // null = not searched yet
  // [] = searched but nothing found
  // [...] = found visitors

  const handleSearch = async () => {
    if (!idNumber.trim()) {
      Alert.alert('Error', 'Please enter an ID number')
      return
    }

    try {
      setLoading(true)
      setResults(null)
      const data = await visitorService.search(idNumber.trim())
      setResults(data)
    } catch (err) {
      // 404 means not found
      if (err.response?.status === 404) {
        setResults([])
      } else {
        Alert.alert('Error', 'Search failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectVisitor = (visitor) => {
    // Pass the visitor to the next screen
    navigation.navigate('VisitorFound', { visitor })
  }

  const handleManualCheckIn = () => {
    navigation.navigate('ManualCheckIn', { idNumber })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <View style={styles.container}>

      {/* Search bar */}
      <View style={styles.searchSection}>
        <Text style={styles.title}>Search Visitor</Text>
        <Text style={styles.subtitle}>
          Enter visitor's ID or passport number
        </Text>

        <Input
          label="ID / Passport Number"
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder="Enter ID number"
        />

        <Button
          title="Search"
          onPress={handleSearch}
          loading={loading}
        />
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color="#9333ea" size="large" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Not searched yet */}
      {!loading && results === null && (
        <View style={styles.centered}>
          <Text style={styles.hintIcon}>🔍</Text>
          <Text style={styles.hintText}>
            Enter an ID number to search
          </Text>
        </View>
      )}

      {/* No results found */}
      {!loading && results !== null && results.length === 0 && (
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>❌</Text>
          <Text style={styles.notFoundTitle}>Visitor Not Found</Text>
          <Text style={styles.notFoundSub}>
            No approved visitor found with ID: {idNumber}
          </Text>

          {/* Manual check in option */}
          <View style={styles.manualSection}>
            <Text style={styles.manualTitle}>
              Want to register them manually?
            </Text>
            <Button
              title="Manual Check In"
              variant="secondary"
              onPress={handleManualCheckIn}
              style={styles.manualButton}
            />
          </View>
        </View>
      )}

      {/* Results found */}
      {!loading && results !== null && results.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </Text>

          {results.map((visitor) => (
            <TouchableOpacity
              key={visitor.id}
              style={[
                styles.resultCard,
                visitor.status === 'approved' && styles.resultCardApproved,
                visitor.status === 'rejected' && styles.resultCardRejected,
              ]}
              onPress={() => handleSelectVisitor(visitor)}
              disabled={visitor.status !== 'approved'}
            >
              {/* Name and status */}
              <View style={styles.resultHeader}>
                <Text style={styles.resultName}>{visitor.full_name}</Text>
                <StatusBadge status={visitor.status} />
              </View>

              {/* Details */}
              <Text style={styles.resultDetail}>
                🪪 {visitor.id_number}
              </Text>
              {visitor.reason && (
                <Text style={styles.resultDetail}>
                  📝 {visitor.reason}
                </Text>
              )}
              <Text style={styles.resultDetail}>
                📅 {formatDate(visitor.visit_date)}
              </Text>

              {/* Tap hint */}
              {visitor.status === 'approved' && (
                <Text style={styles.tapHint}>
                  Tap to check in →
                </Text>
              )}
              {visitor.status !== 'approved' && (
                <Text style={styles.cannotCheckIn}>
                  Cannot check in — status is {visitor.status}
                </Text>
              )}

            </TouchableOpacity>
          ))}

        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  searchSection: {
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 16,
  },
  hintIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  hintText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  notFoundIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notFoundSub: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  manualSection: {
    width: '100%',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  manualTitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  manualButton: {
    width: '100%',
  },
  results: {
    padding: 16,
  },
  resultsTitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  resultCardApproved: {
    borderColor: '#16a34a',
  },
  resultCardRejected: {
    borderColor: '#dc2626',
    opacity: 0.7,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  resultDetail: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  tapHint: {
    color: '#4ade80',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '600',
  },
  cannotCheckIn: {
    color: '#f87171',
    fontSize: 13,
    marginTop: 8,
  }
})

export default SearchVisitorScreen