import { useState } from 'react'
import { Mail, Lock, User, LogIn, UserPlus, LogOut, Heart, MessageCircle, Share2 } from 'lucide-react'
import { validateLoginForm, validateRegisterForm } from '../utils/validation'
import Toast from './Toast'

function AuthSidebar({ onLogin, onLogout, user, isDarkMode = true }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let validation
    if (isLogin) {
      validation = validateLoginForm({
        email: formData.email,
        password: formData.password
      })
    } else {
      validation = validateRegisterForm(formData)
    }

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    const userData = {
      id: Date.now(),
      name: isLogin ? formData.email.split('@')[0] : formData.name,
      email: formData.email
    }

    onLogin(userData)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    
    // Hiển thị thông báo thành công
    setSuccessMessage(isLogin ? 'Đăng nhập thành công! 🎉' : 'Đăng ký thành công! 🎉')
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setSuccessMessage('')
  }

  // Lấy ký tự đầu tiên của tên để làm avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      {successMessage && (
        <Toast 
          message={successMessage} 
          onClose={() => setSuccessMessage('')}
          isDarkMode={isDarkMode}
        />
      )}
      <div className="fixed right-4 top-6 h-[calc(100vh-2rem)] w-80 rounded-3xl overflow-hidden z-40">
        <div className={`shadow-2xl p-4 h-full overflow-y-auto flex flex-col transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white'
            : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white'
        }`}>
          {/* User Profile View */}
          {user ? (
            <>
              {/* Profile Header */}
              <div className="text-center mb-6">
                {/* Avatar */}
                <div className="inline-block w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mb-4 border-2 border-white border-opacity-40">
                  <span className="text-3xl font-bold text-white">{getInitials(user.name)}</span>
                </div>
                
                {/* User Info */}
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm text-white text-opacity-80 truncate">{user.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 px-2">
                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-white text-opacity-80">Bài viết</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">48</div>
                  <div className="text-xs text-white text-opacity-80">Theo dõi</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs text-white text-opacity-80">Người theo</div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-sm mb-3">Hoạt động gần đây</h3>
                <div className="space-y-2 text-sm text-white text-opacity-90">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-red-300" />
                    <span>Bạn thích 5 bài viết</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-blue-300" />
                    <span>Bạn bình luận 3 lần</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-green-300" />
                    <span>Bạn chia sẻ 2 bài viết</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout()
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                }}
                className={`w-full font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition duration-200 flex items-center justify-center gap-2 mt-auto ${
                  isDarkMode
                    ? 'bg-red-500 bg-opacity-30 hover:bg-opacity-40 text-white border border-red-300 border-opacity-50'
                    : 'bg-red-400 bg-opacity-30 hover:bg-opacity-40 text-white border border-red-300'
                }`}
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-block bg-white bg-opacity-20 p-3 rounded-full mb-3">
                  {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                </h2>
                <p className="text-sm text-white text-opacity-80">
                  {isLogin ? 'Chào mừng quay trở lại' : 'Gia nhập cộng đồng n8n'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-white text-opacity-90 mb-1.5">
                      Tên đầy đủ
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-white text-opacity-80" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tên của bạn"
                        className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-40 border-2 border-white border-opacity-40 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 transition text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-white text-opacity-90 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-white text-opacity-80" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-25 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:bg-opacity-35 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white text-opacity-90 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-white text-opacity-80" size={18} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-25 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:bg-opacity-35 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition text-sm"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold text-white text-opacity-90 mb-1.5">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-white text-opacity-80" size={18} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-40 border-2 border-white border-opacity-40 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 transition text-sm"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-2.5 bg-red-400 bg-opacity-20 border border-red-300 border-opacity-50 text-white text-xs rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition duration-200 flex items-center justify-center gap-2 mt-4 ${
                    isDarkMode
                      ? 'bg-white text-purple-600'
                      : 'bg-white text-teal-600'
                  }`}
                >
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                </button>
              </form>

              {/* Toggle Form */}
              <div className="mt-4 pt-4 border-t border-white border-opacity-20 text-center">
                <p className="text-xs text-white text-opacity-80 mb-2">
                  {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                </p>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-sm font-semibold text-white hover:text-opacity-80 transition underline"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AuthSidebar