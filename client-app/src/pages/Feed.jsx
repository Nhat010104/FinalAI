import { useState, useEffect } from 'react'
import { Search, LogOut, Mail, Lock, LogIn, Filter, X } from 'lucide-react'
import InvoiceCard from '../components/InvoiceCard'
import { API_ENDPOINTS } from '../utils/constants'
import { validateLoginForm } from '../utils/validation'

function Feed() {
  const [invoices, setInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all') // all, published, unpublished
  const [filterSource, setFilterSource] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  
  // Login form state
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    const tokenData = sessionStorage.getItem('token')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    if (tokenData) {
      setToken(tokenData)
      loadInvoices()
    } else {
      setShowLogin(true)
    }
  }, [])

  const loadInvoices = async () => {
    const tokenData = sessionStorage.getItem('token')
    if (!tokenData) {
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.VAT.GET_ALL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
          setUser(null)
          setToken(null)
          setShowLogin(true)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Không thể tải danh sách hóa đơn')
        }
        return
      }

      const data = await response.json()
      setInvoices(data || [])
    } catch (err) {
      setError('Có lỗi xảy ra khi tải danh sách hóa đơn: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const validation = validateLoginForm(loginData)
    if (!validation.valid) {
      setLoginError(validation.error)
      return
    }

    setLoginLoading(true)
    setLoginError('')

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Đăng nhập thất bại')
      }

      const data = await response.json()
      sessionStorage.setItem('token', data.token)
      const userData = {
        ...data.user,
        name: data.user.email.split('@')[0],
      }
      sessionStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      setToken(data.token)
      setShowLogin(false)
      setLoginData({ email: '', password: '' })
      loadInvoices()
    } catch (err) {
      setLoginError(err.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setUser(null)
    setToken(null)
    setInvoices([])
    setShowLogin(true)
  }

  const clearFilters = () => {
    setFilterStatus('all')
    setFilterSource('')
    setFilterDateFrom('')
    setFilterDateTo('')
  }

  // Get unique sources for filter dropdown
  const uniqueSources = [...new Set(invoices.map(inv => inv.source).filter(Boolean))]

  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const fileName = invoice.fileName?.toLowerCase() || ''
    const source = invoice.source?.toLowerCase() || ''
    const subject = invoice.invoiceId?.subject?.toLowerCase() || ''
    const senderEmail = invoice.invoiceId?.senderEmail?.toLowerCase() || ''
    
    const matchesSearch = !searchTerm || 
      fileName.includes(searchLower) ||
      source.includes(searchLower) ||
      subject.includes(searchLower) ||
      senderEmail.includes(searchLower)

    // Status filter
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && invoice.isPublished) ||
      (filterStatus === 'unpublished' && !invoice.isPublished)

    // Source filter
    const matchesSource = !filterSource || 
      invoice.source?.toLowerCase().includes(filterSource.toLowerCase())

    // Date filter
    let matchesDate = true
    if (filterDateFrom || filterDateTo) {
      const invoiceDate = new Date(invoice.uploadedDate)
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom)
        fromDate.setHours(0, 0, 0, 0)
        if (invoiceDate < fromDate) matchesDate = false
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo)
        toDate.setHours(23, 59, 59, 999)
        if (invoiceDate > toDate) matchesDate = false
      }
    }

    return matchesSearch && matchesStatus && matchesSource && matchesDate
  })

  const hasActiveFilters = filterStatus !== 'all' || filterSource || filterDateFrom || filterDateTo

  // Login form
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-600 text-white p-3 rounded-full mb-4">
              <LogIn size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">VAT Management</h1>
            <p className="text-gray-600 mt-2">Hệ thống quản lý hóa đơn VAT</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition duration-200 hover:bg-blue-700 flex items-center justify-center gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main invoice view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hóa đơn VAT</h1>
            <p className="text-gray-600 mt-1">Quản lý và xem hóa đơn của bạn</p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm hóa đơn (tên file, nguồn VAT, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border-2 rounded-xl transition flex items-center gap-2 font-semibold ${
                hasActiveFilters
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={20} />
              Lọc
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {[filterStatus !== 'all' && '1', filterSource && '1', filterDateFrom && '1', filterDateTo && '1'].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={20} />
                  Bộ lọc
                </h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-gray-900"
                  >
                    <option value="all">Tất cả</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="unpublished">Chưa xuất bản</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nguồn VAT
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập nguồn VAT..."
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-gray-900"
                    list="sources-list"
                  />
                  <datalist id="sources-list">
                    {uniqueSources.map((source, idx) => (
                      <option key={idx} value={source} />
                    ))}
                  </datalist>
                </div>

                {/* Date From Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-gray-900"
                  />
                </div>

                {/* Date To Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    min={filterDateFrom}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Đang tải hóa đơn...</p>
          </div>
        )}

        {/* Invoices Grid */}
        {!loading && (
          <>
            {filteredInvoices.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Hiển thị <span className="font-semibold text-gray-800">{filteredInvoices.length}</span> / {invoices.length} hóa đơn
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 text-blue-600 hover:text-blue-700 font-semibold underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInvoices.map(invoice => (
                    <InvoiceCard 
                      key={invoice._id || invoice.id} 
                      invoice={invoice} 
                      apiBaseUrl={API_ENDPOINTS.BASE_URL}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-lg font-semibold text-gray-700">
                  {searchTerm || hasActiveFilters ? 'Không tìm thấy hóa đơn nào phù hợp' : 'Chưa có hóa đơn nào'}
                </p>
                {(searchTerm || hasActiveFilters) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      clearFilters()
                    }}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
                {!token && !searchTerm && !hasActiveFilters && (
                  <p className="text-sm mt-2 text-gray-500">Vui lòng đăng nhập để xem hóa đơn</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Feed
