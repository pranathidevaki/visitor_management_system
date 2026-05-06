// Layout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/visitors':  'Visitor Management',
  '/guards':    'Guards',
  '/settings':  'Settings',
}

const Layout = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Visitor Management System'

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar title={title} />
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0a0f1e',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: '#060b14',
  },
}

export default Layout