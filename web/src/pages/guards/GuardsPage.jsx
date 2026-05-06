import { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import api from '../../services/api'

const GuardsPage = () => {

  const [guards, setGuards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [form, setForm] = useState({
  full_name: '', 
  email: '', 
  password: '', 
  phone: '',
  building_id: ''    // ADD THIS
})
const [buildings, setBuildings] = useState([])    // ADD THIS
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
  fetchGuards()
  fetchBuildings()    // ADD THIS
}, [])

  const fetchGuards = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/guards')
      setGuards(response.data.guards)
    } catch (err) {
      setError('Failed to load guards')
    } finally {
      setLoading(false)
    }
  }

  const fetchBuildings = async () => {
  try {
    const response = await api.get('/settings/buildings')
    setBuildings(response.data.buildings)
  } catch (err) {
    console.error(err)
  }
}

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreateGuard = async () => {
  if (!form.full_name || !form.email || !form.password || !form.building_id) {
    setFormError('All fields including building are required')
    return
  }
  try {
    setCreating(true)
    setFormError('')
    await api.post('/auth/register', { 
      ...form, 
      role: 'guard' 
    })
    setForm({ full_name: '', email: '', password: '', phone: '', building_id: '' })
    setCreateModalOpen(false)
    fetchGuards()
  } catch (err) {
    setFormError(err.response?.data?.error || 'Failed to create guard')
  } finally {
    setCreating(false)
  }
}

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading guards...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Guards</h2>
          <p style={styles.subtitle}>
            {guards.length} guard{guards.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          style={styles.addBtn}
          onMouseEnter={(e) => {
            e.target.style.background =
              'linear-gradient(135deg, #a21caf, #7c3aed)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              'linear-gradient(135deg, #c026d3, #9333ea)'
          }}
        >
          + Add Guard
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>⚠️ {error}</div>
      )}

      {/* Empty state */}
      {guards.length === 0 ? (
        <div style={styles.emptyCard}>
          <p style={styles.emptyIcon}>💂</p>
          <p style={styles.emptyTitle}>No guards yet</p>
          <p style={styles.emptySub}>
            Click "Add Guard" to create your first guard account
          </p>
        </div>
      ) : (

        /* Guards grid */
        <div style={styles.grid}>
          {guards.map((guard) => (
            <div key={guard.id} style={styles.guardCard}>

              {/* Top section */}
              <div style={styles.cardTop}>
                {/* Avatar */}
                <div style={styles.avatar}>
                  {guard.full_name.charAt(0).toUpperCase()}
                </div>
                {/* Online indicator */}
                <div style={styles.onlineBadge}>
                  <div style={styles.onlineDot} />
                  <span style={styles.onlineText}>Active</span>
                </div>
              </div>

              {/* Guard info */}
              <div style={styles.cardInfo}>
                <h3 style={styles.guardName}>{guard.full_name}</h3>
                <p style={styles.guardEmail}>{guard.email}</p>
                {guard.phone && (
                  <p style={styles.guardPhone}>📞 {guard.phone}</p>
                )}
                {guard.building_id && (
  <p style={styles.guardBuilding}>
    🏢 {buildings.find(b => b.id === guard.building_id)?.name || 'Unknown building'}
  </p>
)}
              </div>

              {/* Footer */}
              <div style={styles.cardFooter}>
                <span style={styles.roleTag}>Guard</span>
                <span style={styles.dateText}>
                  Since {formatDate(guard.created_at)}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create Guard Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false)
          setFormError('')
          setForm({ full_name: '', email: '', password: '', phone: '' })
        }}
        title="Add New Guard"
      >
        <div style={styles.modalContent}>

          {formError && (
            <div style={styles.formError}>⚠️ {formError}</div>
          )}

          {[
            { name: 'full_name', label: 'Full Name *',  type: 'text',     placeholder: 'John Smith'           },
            { name: 'email',     label: 'Email *',      type: 'email',    placeholder: 'guard@vms.com'   },
            { name: 'password',  label: 'Password *',   type: 'password', placeholder: '••••••••'             },
            { name: 'phone',     label: 'Phone',        type: 'text',     placeholder: '+971501234567'        },
          ].map((field) => (
            <div key={field.name} style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleFormChange}
                placeholder={field.placeholder}
                style={styles.fieldInput}
                onFocus={(e) => e.target.style.borderColor = '#c026d3'}
                onBlur={(e) => e.target.style.borderColor = '#1e293b'}
              />
            </div>
          ))}

<div style={styles.fieldGroup}>
  <label style={styles.fieldLabel}>Assign to Building *</label>
  <select
    value={form.building_id}
    onChange={(e) => setForm(prev => ({
      ...prev, building_id: e.target.value
    }))}
    style={{
      ...styles.fieldInput,
      cursor: 'pointer',
    }}
    onFocus={(e) => e.target.style.borderColor = '#c026d3'}
    onBlur={(e) => e.target.style.borderColor = '#1e293b'}
  >
    <option value="">Select a building</option>
    {buildings.map((building) => (
      <option key={building.id} value={building.id}>
        {building.name}
      </option>
    ))}
  </select>
</div>

          <div style={styles.modalBtns}>
            <button
              onClick={() => setCreateModalOpen(false)}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGuard}
              disabled={creating}
              style={{
                ...styles.createBtn,
                opacity: creating ? 0.7 : 1,
              }}
            >
              {creating ? 'Creating...' : 'Create Guard'}
            </button>
          </div>

        </div>
      </Modal>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
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

  // HEADER
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },
  addBtn: {
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(192,38,211,0.3)',
    transition: 'all 0.2s',
  },

  // ERROR
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '14px',
  },

  // EMPTY
  emptyCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '60px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0 0 16px 0',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  emptySub: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },

  // GRID
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  guardCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'border-color 0.2s',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '20px',
    boxShadow: '0 0 20px rgba(192,38,211,0.3)',
  },
  onlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '20px',
    padding: '4px 10px',
  },
  onlineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px rgba(34,197,94,0.5)',
  },
  onlineText: {
    color: '#22c55e',
    fontSize: '11px',
    fontWeight: '500',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  guardName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  guardEmail: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  },
  guardPhone: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  },
  guardBuilding: {
  color: '#c026d3',
  fontSize: '13px',
  margin: 0,
},
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    borderTop: '1px solid #1e293b',
  },
  roleTag: {
    backgroundColor: 'rgba(192,38,211,0.1)',
    border: '1px solid rgba(192,38,211,0.2)',
    borderRadius: '6px',
    padding: '3px 10px',
    color: '#c026d3',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  dateText: {
    color: '#334155',
    fontSize: '11px',
  },

  // MODAL
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formError: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fca5a5',
    fontSize: '13px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
  },
  fieldInput: {
    backgroundColor: '#0a0f1e',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '11px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  modalBtns: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '12px',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
  },
  createBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

export default GuardsPage