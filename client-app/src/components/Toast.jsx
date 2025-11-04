import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

function Toast({ message, onClose, isDarkMode = true }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 transition-all ${
      isDarkMode
        ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-50 text-green-100'
        : 'bg-green-400 bg-opacity-20 border border-green-500 border-opacity-50 text-green-700'
    }`}>
      <CheckCircle size={20} className={isDarkMode ? 'text-green-300' : 'text-green-600'} />
      <span className="font-medium text-sm">{message}</span>
    </div>
  )
}

export default Toast