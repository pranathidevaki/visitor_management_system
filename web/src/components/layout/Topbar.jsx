// Topbar.jsx
// Redesigned to match Visitor Management System branding

const Topbar = ({ title }) => {
  return (
    <div style={styles.topbar}>
      <div style={styles.left}>
        <h2 style={styles.title}>{title}</h2>
      </div>
      <div style={styles.right}>
        <div style={styles.statusDot} />
        <span style={styles.statusText}>System Online</span>
      </div>
    </div>
  )
}

const styles = {
  topbar: {
    height: '60px',
    backgroundColor: '#0a0f1e',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.3px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 8px rgba(34,197,94,0.5)',
  },
  statusText: {
    color: '#64748b',
    fontSize: '12px',
  },
}

export default Topbar