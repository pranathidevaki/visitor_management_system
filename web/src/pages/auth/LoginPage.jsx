// LoginPage.jsx
// Redesigned to match Visitor Management System branding
// Dark navy + purple gradient like the PDFs

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      if (user.role !== 'admin') {
        setError('Only admins can access this dashboard')
        setLoading(false)
        return
      }

      login(user, token)
      navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>

      {/* Left side - branding */}
      <div style={styles.left}>

        {/* Background circles for depth */}
        <div style={styles.circle1} />
        <div style={styles.circle2} />

        {/* Logo and text */}
        <div style={styles.brandContent}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoOuter}>
              <div style={styles.logoInner}>
                <div style={styles.logoCore} />
              </div>
            </div>
          </div>

          <h1 style={styles.brandName}>VISITOR MANAGEMENT</h1>
          <p style={styles.brandName}>SYSTEM</p>

          <div style={styles.divider} />
        </div>

      </div>

      {/* Right side - login form */}
      <div style={styles.right}>
        <div style={styles.formCard}>

          {/* Header */}
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>
              Sign in to your admin account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <div style={styles.form}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vms.com"
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c026d3'
                    e.target.style.boxShadow = '0 0 0 3px rgba(192,38,211,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1e293b'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c026d3'
                    e.target.style.boxShadow = '0 0 0 3px rgba(192,38,211,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1e293b'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.loginBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background =
                    'linear-gradient(135deg, #a21caf, #7c3aed)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, #c026d3, #9333ea)'
              }}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign In →</span>
              )}
            </button>

          </div>

          {/* Footer */}
          <p style={styles.formFooter}>
            Visitor Management System © 2026
          </p>

        </div>
      </div>

    </div>
  )
}

// Inline styles
// We use inline styles here for the login page
// because it has custom gradients and effects
// that are easier to control this way
const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0a0f1e',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },

  // LEFT SIDE
  left: {
    width: '45%',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(192,38,211,0.15) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
  },
  circle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)',
    bottom: '-50px',
    left: '-50px',
  },
  brandContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '40px',
  },

  // LOGO
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoOuter: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 40px rgba(192,38,211,0.4)',
  },
  logoInner: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCore: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
  },

  brandName: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '6px',
    margin: '0 0 4px 0',
  },
  brandSub: {
    color: '#c026d3',
    fontSize: '11px',
    letterSpacing: '4px',
    margin: '0 0 24px 0',
  },
  divider: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #c026d3, transparent)',
    margin: '0 auto 24px auto',
  },
  brandDesc: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: '0 0 8px 0',
  },
  brandTagline: {
    color: '#64748b',
    fontSize: '13px',
    letterSpacing: '2px',
    margin: 0,
  },

  // RIGHT SIDE
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#0a0f1e',
  },
  formCard: {
    width: '100%',
    maxWidth: '420px',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  formSubtitle: {
    color: '#64748b',
    fontSize: '15px',
    margin: 0,
  },

  // ERROR
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorIcon: {
    fontSize: '16px',
  },

  // FORM
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '16px',
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '14px 14px 14px 44px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  loginBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #c026d3, #9333ea)',
    border: 'none',
    borderRadius: '10px',
    padding: '15px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
    marginTop: '4px',
    boxShadow: '0 4px 20px rgba(192,38,211,0.3)',
  },
  formFooter: {
    color: '#334155',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '32px',
  },
}

export default LoginPage