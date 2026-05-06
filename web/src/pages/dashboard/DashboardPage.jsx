import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import visitorService from '../../services/visitorService'

const PIE_COLORS = ['#c026d3', '#eab308', '#22c55e', '#ef4444']

const DashboardPage = () => {

  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await visitorService.getAll()
      setVisitors(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total:    visitors.length,
    pending:  visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    rejected: visitors.filter(v => v.status === 'rejected').length,
  }

  const pieData = [
    { name: 'Total',    value: stats.total    },
    { name: 'Pending',  value: stats.pending  },
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected },
  ]

  const visitorsByDate = visitors.reduce((acc, visitor) => {
    const date = new Date(visitor.created_at)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(visitorsByDate)
    .map(([date, count]) => ({ date, count }))
    .slice(-7)

  const recentVisitors = [...visitors]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // this automatically detects the user's timezone
    // and converts the UTC time from the database
    // to whatever timezone the browser is in
  })
}
  const statusStyles = {
    pending:   { bg: 'rgba(234,179,8,0.1)',   color: '#eab308',  border: 'rgba(234,179,8,0.3)'   },
    approved:  { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e',  border: 'rgba(34,197,94,0.3)'   },
    rejected:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444',  border: 'rgba(239,68,68,0.3)'   },
    cancelled: { bg: 'rgba(100,116,139,0.1)', color: '#64748b',  border: 'rgba(100,116,139,0.3)' },
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* ── STAT CARDS ── */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Visitors', value: stats.total,
            color: '#c026d3', icon: '👥',
            bg: 'rgba(192,38,211,0.1)', border: 'rgba(192,38,211,0.2)' },
          { label: 'Pending Review', value: stats.pending,
            color: '#eab308', icon: '⏳',
            bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
          { label: 'Approved',       value: stats.approved,
            color: '#22c55e', icon: '✅',
            bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
          { label: 'Rejected',       value: stats.rejected,
            color: '#ef4444', icon: '❌',
            bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
        ].map((card) => (
          <div key={card.label} style={{
            ...styles.statCard,
            backgroundColor: card.bg,
            border: `1px solid ${card.border}`,
          }}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>{card.label}</p>
              <span style={styles.statIcon}>{card.icon}</span>
            </div>
            <p style={{ ...styles.statValue, color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div style={styles.chartsRow}>

        {/* Area Chart */}
        <div style={styles.chartCard}>
          <p style={styles.cardTitle}>Visitors Over Time</p>

          {chartData.length === 0 ? (
            <div style={styles.emptyChart}>
              <p style={styles.emptyText}>Not enough data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c026d3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c026d3" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#334155"
                       tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#334155"
                       tick={{ fill: '#64748b', fontSize: 11 }}
                       allowDecimals={false} />
                <Tooltip contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#fff'
                }} />
                <Area type="monotone" dataKey="count"
                      stroke="#c026d3" strokeWidth={2}
                      fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div style={styles.pieCard}>
          <p style={styles.cardTitle}>Status Breakdown</p>

          {stats.total === 0 ? (
            <div style={styles.emptyChart}>
              <p style={styles.emptyText}>No data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%"
                       innerRadius={40} outerRadius={70}
                       paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#fff'
                  }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={styles.legend}>
                {pieData.map((entry, index) => (
                  <div key={entry.name} style={styles.legendItem}>
                    <div style={{
                      ...styles.legendDot,
                      backgroundColor: PIE_COLORS[index]
                    }} />
                    <span style={styles.legendLabel}>{entry.name}</span>
                    <span style={styles.legendValue}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* ── RECENT VISITORS ── */}
      <div style={styles.recentCard}>
        <p style={styles.cardTitle}>Recent Visitors</p>

        {recentVisitors.length === 0 ? (
          <div style={styles.emptyChart}>
            <p style={styles.emptyText}>No visitors yet</p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={styles.tableHeader}>
              {['Name', 'ID Number', 'Reason', 'Submitted', 'Status'].map(col => (
                <p key={col} style={styles.tableHeaderCell}>{col}</p>
              ))}
            </div>

            {/* Table rows */}
            {recentVisitors.map((visitor, index) => (
              <div key={visitor.id} style={{
                ...styles.tableRow,
                backgroundColor: index % 2 === 0
                  ? 'transparent'
                  : 'rgba(255,255,255,0.02)'
              }}>
                <p style={styles.tableCell}>{visitor.full_name}</p>
                <p style={{ ...styles.tableCell, ...styles.mono }}>
                  {visitor.id_number}
                </p>
                <p style={{ ...styles.tableCell, color: '#64748b' }}>
                  {visitor.reason || '—'}
                </p>
                <p style={{ ...styles.tableCell, color: '#64748b' }}>
                  {formatDate(visitor.created_at)}
                </p>
                <div style={styles.tableCell}>
                  <span style={{
                    backgroundColor: statusStyles[visitor.status]?.bg,
                    color: statusStyles[visitor.status]?.color,
                    border: `1px solid ${statusStyles[visitor.status]?.border}`,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    {visitor.status.charAt(0).toUpperCase() +
                     visitor.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
  },

  // STATS
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    borderRadius: '12px',
    padding: '20px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
  },
  statIcon: {
    fontSize: '20px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    margin: 0,
    lineHeight: 1,
  },

  // CHARTS
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
  },
  chartCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
  },
  pieCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    letterSpacing: '0.3px',
  },
  emptyChart: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px',
  },
  emptyText: {
    color: '#334155',
    fontSize: '14px',
    margin: 0,
  },

  // PIE LEGEND
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendLabel: {
    color: '#64748b',
    fontSize: '12px',
    flex: 1,
  },
  legendValue: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
  },

  // RECENT TABLE
  recentCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 2fr 2fr 1fr',
    padding: '8px 12px',
    marginBottom: '4px',
  },
  tableHeaderCell: {
    color: '#334155',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 2fr 2fr 1fr',
    padding: '12px',
    borderRadius: '8px',
    alignItems: 'center',
  },
  tableCell: {
    color: '#e2e8f0',
    fontSize: '13px',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mono: {
    fontFamily: 'monospace',
    color: '#94a3b8',
  },
}

export default DashboardPage