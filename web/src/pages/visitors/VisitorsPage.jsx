import { useState, useEffect } from 'react'
import visitorService from '../../services/visitorService'
import Modal from '../../components/common/Modal'

const statusStyles = {
  pending:   { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', border: 'rgba(234,179,8,0.3)'   },
  approved:  { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e', border: 'rgba(34,197,94,0.3)'   },
  rejected:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.3)'   },
  cancelled: { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.3)' },
}

const StatusBadge = ({ status }) => (
  <span style={{
    backgroundColor: statusStyles[status]?.bg,
    color: statusStyles[status]?.color,
    border: `1px solid ${statusStyles[status]?.border}`,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  }}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

const VisitorsPage = () => {

  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVisitor, setSelectedVisitor] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const data = await visitorService.getAll()
      setVisitors(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredVisitors = visitors.filter(visitor => {
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter
    const matchesSearch = !search ||
      visitor.full_name.toLowerCase().includes(search.toLowerCase()) ||
      visitor.id_number.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusUpdate = async (visitorId, newStatus) => {
    try {
      setUpdating(true)
      await visitorService.updateStatus(visitorId, newStatus)
      setVisitors(prev => prev.map(v =>
        v.id === visitorId ? { ...v, status: newStatus } : v
      ))
      if (selectedVisitor?.id === visitorId) {
        setSelectedVisitor(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

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

  const counts = {
    all:      visitors.length,
    pending:  visitors.filter(v => v.status === 'pending').length,
    approved: visitors.filter(v => v.status === 'approved').length,
    rejected: visitors.filter(v => v.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading visitors...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* ── FILTER CARDS ── */}
      <div style={styles.filterCards}>
        {[
          { key: 'all',      label: 'All Visitors',   color: '#c026d3', border: 'rgba(192,38,211,0.3)', bg: 'rgba(192,38,211,0.1)' },
          { key: 'pending',  label: 'Pending Review',  color: '#eab308', border: 'rgba(234,179,8,0.3)',  bg: 'rgba(234,179,8,0.1)'  },
          { key: 'approved', label: 'Approved',        color: '#22c55e', border: 'rgba(34,197,94,0.3)',  bg: 'rgba(34,197,94,0.1)'  },
          { key: 'rejected', label: 'Rejected',        color: '#ef4444', border: 'rgba(239,68,68,0.3)',  bg: 'rgba(239,68,68,0.1)'  },
        ].map((card) => (
          <button
            key={card.key}
            onClick={() => setStatusFilter(card.key)}
            style={{
              ...styles.filterCard,
              border: statusFilter === card.key
                ? `1px solid ${card.border}`
                : '1px solid #1e293b',
              backgroundColor: statusFilter === card.key
                ? card.bg
                : '#0f172a',
              cursor: 'pointer',
            }}
          >
            <p style={styles.filterLabel}>{card.label}</p>
            <p style={{ ...styles.filterCount, color: card.color }}>
              {counts[card.key]}
            </p>
          </button>
        ))}
      </div>

      {/* ── TABLE CARD ── */}
      <div style={styles.tableCard}>

        {/* Table header */}
        <div style={styles.tableTop}>
          <div>
            <p style={styles.tableTitle}>
              {statusFilter === 'all' ? 'All Visitors' :
               statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <span style={styles.tableCount}>
                {' '}({filteredVisitors.length})
              </span>
            </p>
          </div>
          <div style={styles.tableActions}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#c026d3'}
              onBlur={(e) => e.target.style.borderColor = '#1e293b'}
            />
            <button onClick={fetchVisitors} style={styles.refreshBtn}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredVisitors.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>👥</p>
            <p style={styles.emptyText}>No visitors found</p>
          </div>
        ) : (

          <div style={styles.tableWrapper}>
            <table style={styles.table}>

              {/* Column headers */}
              <thead>
                <tr style={styles.thead}>
                  {['Name', 'ID Number', 'Phone',
                    'Reason', 'Submitted', 'Status', 'Actions'
                  ].map(col => (
                    <th key={col} style={styles.th}>{col}</th>
                  ))}
                </tr>
              </thead>

              {/* Rows */}
              <tbody>
                {filteredVisitors.map((visitor, index) => (
                  <tr
                    key={visitor.id}
                    style={{
                      ...styles.tr,
                      backgroundColor: index % 2 === 0
                        ? 'transparent'
                        : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <td style={styles.td}>
                      <p style={styles.nameText}>{visitor.full_name}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.monoText}>{visitor.id_number}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.mutedText}>{visitor.phone || '—'}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={{
                        ...styles.mutedText,
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {visitor.reason || '—'}
                      </p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.mutedText}>
                        {formatDate(visitor.created_at)}
                      </p>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={visitor.status} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button
                          onClick={() => {
                            setSelectedVisitor(visitor)
                            setDetailModalOpen(true)
                          }}
                          style={styles.viewBtn}
                        >
                          View
                        </button>
                        {visitor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(visitor.id, 'approved')}
                              disabled={updating}
                              style={styles.approveBtn}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(visitor.id, 'rejected')}
                              disabled={updating}
                              style={styles.rejectBtn}
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Visitor Details"
      >
        {selectedVisitor && (
          <div style={styles.modalContent}>

            <div style={styles.modalStatusRow}>
              <StatusBadge status={selectedVisitor.status} />
              <span style={styles.modalDate}>
                {formatDate(selectedVisitor.created_at)}
              </span>
            </div>

            <div style={styles.modalGrid}>
              {[
                { label: 'Full Name',  value: selectedVisitor.full_name  },
                { label: 'ID Number',  value: selectedVisitor.id_number  },
                { label: 'Phone',      value: selectedVisitor.phone || '—' },
                { label: 'Reason',     value: selectedVisitor.reason || '—' },
                { label: 'Visit Date', value: formatDate(selectedVisitor.visit_date) },
                { label: 'Type',       value: selectedVisitor.visitor_types?.name || '—' },
              ].map((item) => (
                <div key={item.label} style={styles.modalField}>
                  <p style={styles.modalFieldLabel}>{item.label}</p>
                  <p style={styles.modalFieldValue}>{item.value}</p>
                </div>
              ))}
            </div>

            {selectedVisitor.status === 'pending' && (
              <div style={styles.modalActions}>
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate(selectedVisitor.id, 'approved')}
                  style={styles.modalApproveBtn}
                >
                  ✓ Approve Visitor
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate(selectedVisitor.id, 'rejected')}
                  style={styles.modalRejectBtn}
                >
                  ✕ Reject Visitor
                </button>
              </div>
            )}

          </div>
        )}
      </Modal>

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
    height: '300px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0,
  },

  // FILTER CARDS
  filterCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  filterCard: {
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  filterLabel: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '0 0 8px 0',
  },
  filterCount: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    lineHeight: 1,
  },

  // TABLE
  tableCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #1e293b',
  },
  tableTitle: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
  },
  tableCount: {
    color: '#64748b',
    fontWeight: '400',
  },
  tableActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchInput: {
    backgroundColor: '#0a0f1e',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    width: '200px',
    transition: 'border-color 0.2s',
  },
  refreshBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '8px 14px',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0 0 12px 0',
  },
  emptyText: {
    color: '#334155',
    fontSize: '16px',
    margin: 0,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  th: {
    color: '#334155',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #1e293b',
  },
  tr: {
    borderBottom: '1px solid rgba(30,41,59,0.5)',
    transition: 'background-color 0.15s',
  },
  td: {
    padding: '14px 16px',
    verticalAlign: 'middle',
  },
  nameText: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
  },
  monoText: {
    color: '#94a3b8',
    fontSize: '13px',
    fontFamily: 'monospace',
    margin: 0,
  },
  mutedText: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  viewBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '6px',
    padding: '5px 12px',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
  },
  approveBtn: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#22c55e',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#ef4444',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '700',
  },

  // MODAL
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalStatusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalDate: {
    color: '#64748b',
    fontSize: '13px',
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  modalField: {
    backgroundColor: '#0a0f1e',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #1e293b',
  },
  modalFieldLabel: {
    color: '#64748b',
    fontSize: '11px',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modalFieldValue: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px',
  },
  modalApproveBtn: {
    flex: 1,
    backgroundColor: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#22c55e',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalRejectBtn: {
    flex: 1,
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

export default VisitorsPage