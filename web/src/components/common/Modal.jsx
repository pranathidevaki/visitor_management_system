// Modal.jsx
// Fixed overlay modal that always appears
// in the center of the screen
// regardless of scroll position or zoom level

import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {

  // Lock body scroll when modal is open
  // so background doesn't scroll behind it
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Fixed overlay covers entire screen
    // position fixed means it stays put
    // even when user scrolls
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {children}
        </div>

      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    // fixed means relative to viewport
    // not relative to the page
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    // z-index 1000 puts it above everything
    padding: '20px',
  },
  modal: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #1e293b',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0f172a',
    zIndex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: '6px',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  content: {
    padding: '24px',
  },
}

export default Modal