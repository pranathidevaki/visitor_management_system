// Sidebar.jsx
// Redesigned to match Visitor Management System branding
// Dark navy with purple accents

import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'Dashboard',          icon: '📊' },
  { path: '/visitors',  label: 'Visitor Management', icon: '👥' },
  { path: '/guards',    label: 'Guards',              icon: '💂' },
  { path: '/settings',  label: 'Settings',            icon: '⚙️' },
]

const Sidebar = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.sidebar}>

      {/* Logo */}
      <div style={styles.logoSection}>
        <div style={styles.logoRow}>
          <div style={styles.logoOuter}>
            <div style={styles.logoInner}>
              <div style={styles.logoCore} />
            </div>
          </div>
          <div>
            <p style={styles.logoName}>VISITOR MANAGEMENT</p>
            <p style={styles.logoSub}>SYSTEM</p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={styles.navSection}>
        <p style={styles.navLabel}>MAIN MENU</p>

        {/* Nav links */}
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && <div style={styles.activeBar} />}

                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={{
                    ...styles.navText,
                    color: isActive ? '#ffffff' : '#64748b',
                  }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom - user info */}
      <div style={styles.bottomSection}>
        <div style={styles.divider} />

        {/* User card */}
        <div style={styles.userCard}>
          <div style={styles.userAvatar}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.full_name}</p>
            <p style={styles.userRole}>Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>🚪</span>
          <span>Sign Out</span>
        </button>

      </div>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    backgroundColor: '#0a0f1e',
    borderRight: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },

  // LOGO
  logoSection: {
    padding: '24px 20px',
    borderBottom: '1px solid #1e293b',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoOuter: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 20px rgba(192,38,211,0.3)',
  },
  logoInner: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#0a0f1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCore: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
  },
  logoName: {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '3px',
    margin: 0,
    lineHeight: 1.2,
  },
  logoSub: {
    color: '#c026d3',
    fontSize: '8px',
    letterSpacing: '2px',
    margin: 0,
  },

  // NAV
  navSection: {
    flex: 1,
    padding: '24px 12px',
  },
  navLabel: {
    color: '#334155',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '2px',
    padding: '0 8px',
    marginBottom: '8px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 12px',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(192,38,211,0.1)',
    border: '1px solid rgba(192,38,211,0.2)',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '60%',
    backgroundColor: '#c026d3',
    borderRadius: '0 4px 4px 0',
  },
  navIcon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center',
  },
  navText: {
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },

  // BOTTOM
  bottomSection: {
    padding: '16px 12px 24px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#1e293b',
    marginBottom: '16px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid #1e293b',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    color: '#64748b',
    fontSize: '11px',
    margin: 0,
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}

export default Sidebar