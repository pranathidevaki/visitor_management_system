import { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import api from '../../services/api'

const SettingsPage = () => {

  const [activeTab, setActiveTab] = useState('buildings')

  // Buildings state
  const [buildings, setBuildings] = useState([])
  const [buildingsLoading, setBuildingsLoading] = useState(true)
  const [buildingModalOpen, setBuildingModalOpen] = useState(false)
  const [buildingForm, setBuildingForm] = useState({ name: '', address: '' })
  const [buildingError, setBuildingError] = useState('')
  const [creatingBuilding, setCreatingBuilding] = useState(false)

  // Visitor types state
  const [visitorTypes, setVisitorTypes] = useState([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [typeModalOpen, setTypeModalOpen] = useState(false)
  const [typeForm, setTypeForm] = useState({ name: '', category: '' })
  const [typeError, setTypeError] = useState('')
  const [creatingType, setCreatingType] = useState(false)

  useEffect(() => {
    fetchBuildings()
    fetchVisitorTypes()
  }, [])

  const fetchBuildings = async () => {
    try {
      setBuildingsLoading(true)
      const response = await api.get('/settings/buildings')
      setBuildings(response.data.buildings)
    } catch (err) {
      console.error(err)
    } finally {
      setBuildingsLoading(false)
    }
  }

  const fetchVisitorTypes = async () => {
    try {
      setTypesLoading(true)
      const response = await api.get('/settings/visitor-types')
      setVisitorTypes(response.data.visitorTypes)
    } catch (err) {
      console.error(err)
    } finally {
      setTypesLoading(false)
    }
  }

  const handleCreateBuilding = async () => {
    if (!buildingForm.name) {
      setBuildingError('Building name is required')
      return
    }
    try {
      setCreatingBuilding(true)
      setBuildingError('')
      await api.post('/settings/buildings', buildingForm)
      setBuildingForm({ name: '', address: '' })
      setBuildingModalOpen(false)
      fetchBuildings()
    } catch (err) {
      setBuildingError(err.response?.data?.error || 'Failed to create building')
    } finally {
      setCreatingBuilding(false)
    }
  }

  const handleCreateType = async () => {
    if (!typeForm.name || !typeForm.category) {
      setTypeError('Name and category are required')
      return
    }
    try {
      setCreatingType(true)
      setTypeError('')
      await api.post('/settings/visitor-types', typeForm)
      setTypeForm({ name: '', category: '' })
      setTypeModalOpen(false)
      fetchVisitorTypes()
    } catch (err) {
      setTypeError(err.response?.data?.error || 'Failed to create visitor type')
    } finally {
      setCreatingType(false)
    }
  }

  const categoryIcons = {
    Visit:       '👥',
    Delivery:    '📦',
    Service:     '🔧',
    Inspection:  '🔍',
    Contractor:  '👷',
  }

  return (
    <div style={styles.container}>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'buildings',    label: '🏢 Buildings'     },
          { key: 'visitorTypes', label: '👤 Visitor Types' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              color: activeTab === tab.key ? '#c026d3' : '#64748b',
              borderBottom: activeTab === tab.key
                ? '2px solid #c026d3'
                : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── BUILDINGS TAB ── */}
      {activeTab === 'buildings' && (
        <div style={styles.tabContent}>

          {/* Header */}
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Buildings</h3>
              <p style={styles.sectionSub}>
                Manage properties in the system
              </p>
            </div>
            <button
              onClick={() => setBuildingModalOpen(true)}
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
              + Add Building
            </button>
          </div>

          {/* Buildings grid */}
          {buildingsLoading ? (
            <div style={styles.centered}>
              <p style={styles.loadingText}>Loading buildings...</p>
            </div>
          ) : buildings.length === 0 ? (
            <div style={styles.emptyCard}>
              <p style={styles.emptyIcon}>🏢</p>
              <p style={styles.emptyTitle}>No buildings yet</p>
              <p style={styles.emptySub}>
                Add your first building to get started
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {buildings.map((building) => (
                <div key={building.id} style={styles.card}>
                  <div style={styles.cardIconWrapper}>
                    <span style={styles.cardIcon}>🏢</span>
                  </div>
                  <h4 style={styles.cardTitle}>{building.name}</h4>
                  {building.address && (
                    <p style={styles.cardSub}>📍 {building.address}</p>
                  )}
                  <div style={styles.cardFooter}>
                    <span style={styles.idTag}>
                      ID: {building.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Building Modal */}
          <Modal
            isOpen={buildingModalOpen}
            onClose={() => {
              setBuildingModalOpen(false)
              setBuildingError('')
              setBuildingForm({ name: '', address: '' })
            }}
            title="Add New Building"
          >
            <div style={styles.modalContent}>
              {buildingError && (
                <div style={styles.formError}>⚠️ {buildingError}</div>
              )}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Building Name *</label>
                <input
                  type="text"
                  value={buildingForm.name}
                  onChange={(e) => setBuildingForm(prev => ({
                    ...prev, name: e.target.value
                  }))}
                  placeholder="Visitor Management System Tower"
                  style={styles.fieldInput}
                  onFocus={(e) => e.target.style.borderColor = '#c026d3'}
                  onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Address</label>
                <input
                  type="text"
                  value={buildingForm.address}
                  onChange={(e) => setBuildingForm(prev => ({
                    ...prev, address: e.target.value
                  }))}
                  placeholder="Dubai Marina"
                  style={styles.fieldInput}
                  onFocus={(e) => e.target.style.borderColor = '#c026d3'}
                  onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div style={styles.modalBtns}>
                <button
                  onClick={() => setBuildingModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBuilding}
                  disabled={creatingBuilding}
                  style={{
                    ...styles.createBtn,
                    opacity: creatingBuilding ? 0.7 : 1
                  }}
                >
                  {creatingBuilding ? 'Creating...' : 'Create Building'}
                </button>
              </div>
            </div>
          </Modal>

        </div>
      )}

      {/* ── VISITOR TYPES TAB ── */}
      {activeTab === 'visitorTypes' && (
        <div style={styles.tabContent}>

          {/* Header */}
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Visitor Types</h3>
              <p style={styles.sectionSub}>
                Categories used when submitting visitors
              </p>
            </div>
            <button
              onClick={() => setTypeModalOpen(true)}
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
              + Add Type
            </button>
          </div>

          {/* Visitor types grid */}
          {typesLoading ? (
            <div style={styles.centered}>
              <p style={styles.loadingText}>Loading visitor types...</p>
            </div>
          ) : visitorTypes.length === 0 ? (
            <div style={styles.emptyCard}>
              <p style={styles.emptyIcon}>👤</p>
              <p style={styles.emptyTitle}>No visitor types yet</p>
              <p style={styles.emptySub}>
                Add types like Family, Delivery, Contractor etc
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {visitorTypes.map((type) => (
                <div key={type.id} style={styles.card}>
                  <div style={styles.cardIconWrapper}>
                    <span style={styles.cardIcon}>
                      {categoryIcons[type.category] || '👤'}
                    </span>
                  </div>
                  <h4 style={styles.cardTitle}>{type.name}</h4>
                  <div style={styles.categoryTag}>
                    {type.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Visitor Type Modal */}
          <Modal
            isOpen={typeModalOpen}
            onClose={() => {
              setTypeModalOpen(false)
              setTypeError('')
              setTypeForm({ name: '', category: '' })
            }}
            title="Add Visitor Type"
          >
            <div style={styles.modalContent}>
              {typeError && (
                <div style={styles.formError}>⚠️ {typeError}</div>
              )}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Type Name *</label>
                <input
                  type="text"
                  value={typeForm.name}
                  onChange={(e) => setTypeForm(prev => ({
                    ...prev, name: e.target.value
                  }))}
                  placeholder="Family and Friends"
                  style={styles.fieldInput}
                  onFocus={(e) => e.target.style.borderColor = '#c026d3'}
                  onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Category *</label>
                <select
                  value={typeForm.category}
                  onChange={(e) => setTypeForm(prev => ({
                    ...prev, category: e.target.value
                  }))}
                  style={{
                    ...styles.fieldInput,
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c026d3'}
                  onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                >
                  <option value="">Select a category</option>
                  <option value="Visit">Visit</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Service">Service</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              <div style={styles.modalBtns}>
                <button
                  onClick={() => setTypeModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateType}
                  disabled={creatingType}
                  style={{
                    ...styles.createBtn,
                    opacity: creatingType ? 0.7 : 1
                  }}
                >
                  {creatingType ? 'Creating...' : 'Create Type'}
                </button>
              </div>
            </div>
          </Modal>

        </div>
      )}

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

  // TABS
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid #1e293b',
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-1px',
  },

  // SECTION
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  sectionSub: {
    color: '#64748b',
    fontSize: '13px',
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

  // STATES
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0,
  },
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
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardIconWrapper: {
    width: '44px',
    height: '44px',
    backgroundColor: 'rgba(192,38,211,0.1)',
    border: '1px solid rgba(192,38,211,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  cardIcon: {
    fontSize: '22px',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    margin: 0,
  },
  cardSub: {
    color: '#64748b',
    fontSize: '13px',
    margin: 0,
  },
  cardFooter: {
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #1e293b',
  },
  idTag: {
    color: '#334155',
    fontSize: '11px',
    fontFamily: 'monospace',
  },
  categoryTag: {
    display: 'inline-block',
    backgroundColor: 'rgba(192,38,211,0.1)',
    border: '1px solid rgba(192,38,211,0.2)',
    borderRadius: '6px',
    padding: '3px 10px',
    color: '#c026d3',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '4px',
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
    width: '100%',
    boxSizing: 'border-box',
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

export default SettingsPage