import { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Alert
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import visitorService from '../../services/visitorService'
import StatusBadge from '../../components/common/StatusBadge'

const ManageVisitorsScreen = () => {

  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // useFocusEffect runs every time this screen
  // comes into focus (when you tap the tab)
  // so data is always fresh
  useFocusEffect(
    useCallback(() => {
      fetchVisitors()
    }, [])
  )

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const data = await visitorService.getMine()
      setVisitors(data)
    } catch (err) {
      Alert.alert('Error', 'Failed to load visitors')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchVisitors()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Each visitor card
  const renderVisitor = ({ item }) => (
    <View style={styles.card}>

      {/* Top row - name and status */}
      <View style={styles.cardHeader}>
        <Text style={styles.visitorName}>{item.full_name}</Text>
        <StatusBadge status={item.status} />
      </View>

      {/* Details */}
      <View style={styles.cardDetails}>
        <Text style={styles.detail}>🪪 {item.id_number}</Text>
        {item.phone && (
          <Text style={styles.detail}>📞 {item.phone}</Text>
        )}
        {item.reason && (
          <Text style={styles.detail}>📝 {item.reason}</Text>
        )}
        <Text style={styles.detail}>
          📅 Submitted {formatDate(item.created_at)}
        </Text>
      </View>

      {/* Visitor type if available */}
      {item.visitor_types?.name && (
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{item.visitor_types.name}</Text>
        </View>
      )}

    </View>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading your visitors...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Visitors</Text>
        <Text style={styles.subtitle}>
          {visitors.length} visitor{visitors.length !== 1 ? 's' : ''} submitted
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={visitors}
        keyExtractor={(item) => item.id}
        renderItem={renderVisitor}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9333ea"
            colors={['#9333ea']}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No visitors yet</Text>
            <Text style={styles.emptySub}>
              Tap Submit Visitor to add your first visitor
            </Text>
          </View>
        }
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitorName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  cardDetails: {
    gap: 6,
  },
  detail: {
    color: '#9ca3af',
    fontSize: 14,
  },
  typeTag: {
    marginTop: 12,
    backgroundColor: '#581c87',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySub: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  }
})

export default ManageVisitorsScreen