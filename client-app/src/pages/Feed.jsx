import { useState, useEffect } from 'react'
import { Search, Plus, Moon, Sun } from 'lucide-react'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import AuthSidebar from '../components/AuthSidebar'

function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: '👨‍💼',
      timestamp: '2 giờ trước',
      title: 'Chào mừng đến với VAT Management System',
      content: 'Hệ thống quản lý hóa đơn VAT hiện đại, giúp bạn dễ dàng theo dõi và quản lý các hóa đơn một cách hiệu quả. Upload, lưu trữ và publish hóa đơn chỉ với vài click!',
      image: null,
      likes: 24,
      comments: 5,
      shares: 2
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: '👩‍💻',
      timestamp: '5 giờ trước',
      title: 'Hướng dẫn sử dụng API Documentation',
      content: 'Bạn đã thử Swagger API Documentation tại /api-docs chưa? Rất tiện để test các endpoint và xem chi tiết request/response. Hỗ trợ JWT authentication và đầy đủ 8 endpoints!',
      image: null,
      likes: 18,
      comments: 3,
      shares: 1
    },
    {
      id: 3,
      author: 'Lê Minh C',
      avatar: '🧑‍🔧',
      timestamp: '1 ngày trước',
      title: 'Tips: Quản lý VAT files hiệu quả',
      content: 'Mẹo nhỏ: Khi upload VAT file, hãy điền đầy đủ thông tin senderEmail, subject và receivedDate để dễ dàng tìm kiếm sau này. Hệ thống sẽ tự động lưu vào MongoDB và có thể sync lên Google Drive!',
      image: null,
      likes: 32,
      comments: 8,
      shares: 5
    },
    {
      id: 4,
      author: 'Phạm Thu D',
      avatar: '👩‍🎓',
      timestamp: '2 ngày trước',
      title: 'Tính năng mới: Real-time Telegram notification',
      content: 'Mỗi khi có VAT file mới được upload hoặc publish, bạn sẽ nhận được thông báo qua Telegram bot. Cấu hình TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID trong .env để kích hoạt!',
      image: null,
      likes: 45,
      comments: 12,
      shares: 7
    },
    {
      id: 5,
      author: 'Hoàng Minh E',
      avatar: '👨‍🏫',
      timestamp: '3 ngày trước',
      title: 'Docker deployment guide',
      content: 'Triển khai toàn bộ hệ thống chỉ với một lệnh: docker-compose up! Backend, Frontend và MongoDB sẽ tự động chạy. Perfect cho production environment.',
      image: null,
      likes: 28,
      comments: 6,
      shares: 4
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // TODO: Load posts from backend API
    // Currently using mock data, replace with API call later
  }, [])

  const handleCreatePost = (newPost) => {
    const post = {
      id: posts.length + 1,
      author: user?.name || 'Bạn',
      avatar: '😊',
      timestamp: 'Vừa xong',
      title: newPost.title,
      content: newPost.content,
      image: newPost.image || null,
      likes: 0,
      comments: 0,
      shares: 0
    }
    setPosts([post, ...posts])
    setShowCreatePost(false)
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <div className="w-full px-4 py-6 sm:py-8 pr-[356px]">
        <div className="w-full">
          {/* Main Feed */}
            {/* Header with Toggle */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'bg-white bg-opacity-10 hover:bg-opacity-20 text-yellow-300' 
                    : 'bg-slate-900 bg-opacity-10 hover:bg-opacity-20 text-slate-700'
                }`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-purple-300' : 'text-blue-400'}`} size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent outline-none shadow-lg transition ${
                    isDarkMode
                      ? 'border-purple-300 bg-white text-slate-900 focus:ring-purple-500'
                      : 'border-blue-200 bg-white bg-opacity-90 text-slate-900 focus:ring-blue-400'
                  }`}
                />
              </div>
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className={`w-full mb-6 text-white font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              }`}
            >
              <Plus size={20} />
              Tạo bài viết mới
            </button>

            {/* Create Post Modal */}
            {showCreatePost && (
              <div className="mb-6">
                <CreatePost onSubmit={handleCreatePost} onCancel={() => setShowCreatePost(false)} />
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-5">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} isDarkMode={isDarkMode} />
                ))
              ) : (
                <div className={`text-center py-12 rounded-xl backdrop-blur-md border transition-colors ${
                  isDarkMode
                    ? 'bg-white bg-opacity-10 border-white border-opacity-20 text-white'
                    : 'bg-slate-200 bg-opacity-50 border-slate-300 text-slate-700'
                }`}>
                  <p className="text-lg font-semibold">Không tìm thấy bài viết nào</p>
                </div>
              )}
            </div>
        </div>
      </div>
      
      {/* Auth Sidebar - Fixed Right */}
      <AuthSidebar 
        isDarkMode={isDarkMode}
        user={user}
        onLogin={(userData) => {
          sessionStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
        }}
        onLogout={() => {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
          setUser(null)
        }}
      />
    </div>
  )
}

export default Feed