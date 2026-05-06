// ProtectedRoute.jsx
// This component wraps all pages that require login
// If you're not logged in → redirect to /login
// If you are logged in → show the page
//
// Think of it as a bouncer for your pages

import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
    // replace means don't keep /dashboard in history
    // so pressing back doesn't bring them back
  }

  // Outlet renders whatever child route is active
  // So if the URL is /dashboard it renders DashboardPage
  // If URL is /visitors it renders VisitorsPage
  return <Outlet />
}

export default ProtectedRoute