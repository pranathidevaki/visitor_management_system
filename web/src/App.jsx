// App.jsx
// This is the ROOT of your entire web app
// Every page lives inside here
// React Router controls which page shows
// based on the URL

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages we'll build (importing them in advance)
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import VisitorsPage from './pages/visitors/VisitorsPage'
import GuardsPage from './pages/guards/GuardsPage'
import SettingsPage from './pages/settings/SettingsPage'

// Layout (the sidebar + topbar that wraps all pages)
import Layout from './components/layout/Layout'

// Auth protection
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route - anyone can see login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - must be logged in */}
        {/* Layout wraps all these so they all have */}
        {/* the same sidebar and topbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/visitors" element={<VisitorsPage />} />
            <Route path="/guards" element={<GuardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* If someone goes to / redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App