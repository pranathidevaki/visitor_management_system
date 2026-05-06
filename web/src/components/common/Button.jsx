// Button.jsx
// Reusable button with different styles
// variant prop controls the look:
// primary   → purple (main actions)
// danger    → red (reject, delete)
// secondary → gray (cancel, back)
// success   → green (approve)

const Button = ({ 
  children,     // the text inside the button
  onClick,      // what happens when clicked
  variant = 'primary',  // default is primary
  disabled = false,
  size = 'md',
  className = ''
}) => {

  const variants = {
    primary:   'bg-purple-600 hover:bg-purple-700 text-white',
    danger:    'bg-red-600    hover:bg-red-700    text-white',
    secondary: 'bg-gray-700   hover:bg-gray-600   text-gray-300',
    success:   'bg-green-600  hover:bg-green-700  text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2   text-sm',
    lg: 'px-6 py-3   text-base',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button