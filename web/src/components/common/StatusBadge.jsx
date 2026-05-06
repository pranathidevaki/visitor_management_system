// StatusBadge.jsx
// The colored pill that shows visitor status
// pending  → yellow
// approved → green
// rejected → red
// cancelled → gray
//
// We build it once and use it everywhere

const StatusBadge = ({ status }) => {

  // Map each status to a color
  const styles = {
    pending:   'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    approved:  'bg-green-500/10  text-green-400  border border-green-500/20',
    rejected:  'bg-red-500/10   text-red-400    border border-red-500/20',
    cancelled: 'bg-gray-500/10  text-gray-400   border border-gray-500/20',
  }

  const style = styles[status] || styles.pending

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
      {/* capitalize first letter */}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge