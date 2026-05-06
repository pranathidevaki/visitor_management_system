import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native'
import useAuthStore from '../../store/authStore'
import visitorService from '../../services/visitorService'

const HomeScreen = ({ navigation }) => {

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      const data = await visitorService.getMine()
      setVisitors(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchVisitors()
  }

  const stats = {
    total:    visitors.length,
    pending:  visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    rejected: visitors.filter(v => v.status === 'rejected').length,
  }

  const recentVisitors = [...visitors]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const statusColor = {
    pending:   '#fbbf24',
    approved:  '#4ade80',
    rejected:  '#f87171',
    cancelled: '#9ca3af',
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#9333ea"
          colors={['#9333ea']}
        />
      }
    >

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.name}>{user?.full_name}</Text>
          <Text style={styles.role}>Resident</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total',    value: stats.total,    color: '#9333ea' },
          { label: 'Pending',  value: stats.pending,  color: '#fbbf24' },
          { label: 'Approved', value: stats.approved, color: '#4ade80' },
          { label: 'Rejected', value: stats.rejected, color: '#f87171' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Submit')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionLabel}>Submit Visitor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('MyVisitors')}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionLabel}>My Visitors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionLabel}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Visitors */}
      <Text style={styles.sectionTitle}>Recent Visitors</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : recentVisitors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No visitors yet</Text>
          <Text style={styles.emptySub}>
            Tap Submit Visitor to get started
          </Text>
        </View>
      ) : (
        recentVisitors.map((visitor) => (
          <View key={visitor.id} style={styles.visitorCard}>
            <View style={styles.visitorLeft}>
              <Text style={styles.visitorName}>{visitor.full_name}</Text>
              <Text style={styles.visitorDate}>
                {formatDate(visitor.created_at)}
              </Text>
            </View>
            <View style={[
              styles.statusPill,
              {
                backgroundColor: statusColor[visitor.status] + '20',
                borderColor: statusColor[visitor.status]
              }
            ]}>
              <Text style={[
                styles.statusText,
                { color: statusColor[visitor.status] }
              ]}>
                {visitor.status.charAt(0).toUpperCase() +
                 visitor.status.slice(1)}
              </Text>
            </View>
          </View>
        ))
      )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    color: '#9ca3af',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  role: {
    color: '#9333ea',
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  logoutText: {
    color: '#9ca3af',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    color: '#9ca3af',
    fontSize: 11,
    textAlign: 'center',
  },
  loadingText: {
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
  emptyCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySub: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  visitorCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  visitorLeft: {
    flex: 1,
  },
  visitorName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  visitorDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  }
})

export default HomeScreen