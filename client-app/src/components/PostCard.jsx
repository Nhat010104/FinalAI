import { useState } from 'react'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

function PostCard({ post, isDarkMode = true }) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState(post.comments)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments(comments + 1)
      setNewComment('')
    }
  }

  return (
    <div className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
      isDarkMode
        ? 'bg-slate-800 border-slate-700 hover:border-purple-500'
        : 'bg-white border-slate-200 hover:border-blue-300'
    }`}>
      {/* Post Header */}
      <div className={`p-4 border-b transition-colors ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-slate-700'
          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="text-4xl bg-gradient-to-br from-purple-400 to-pink-400 p-2 rounded-full">{post.avatar}</div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.author}</h3>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{post.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 sm:p-6">
        <h2 className={`text-lg sm:text-xl font-bold mb-3 ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
        }`}>{post.title}</h2>
        <p className={`text-sm sm:text-base mb-4 leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{post.content}</p>
        
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className={`px-4 sm:px-6 py-3 text-xs sm:text-sm border-t transition-colors ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-slate-700 text-white'
          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex justify-between font-semibold">
          <span className="flex items-center gap-1">
            <span className="text-lg">❤️</span> {likes} lượt thích
          </span>
          <span className="flex items-center gap-1">
            💬 {comments} bình luận • 🔄 {post.shares} chia sẻ
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className={`px-4 sm:px-6 py-3 flex gap-2 border-t transition-colors ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm sm:text-base font-semibold ${
            isLiked
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
              : isDarkMode
              ? 'hover:bg-slate-700 text-white hover:text-red-400'
              : 'hover:bg-red-100 text-slate-700 hover:text-red-600'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          Thích
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm sm:text-base font-semibold ${
            isDarkMode
              ? 'hover:bg-slate-700 text-white hover:text-blue-400'
              : 'hover:bg-blue-100 text-slate-700 hover:text-blue-600'
          }`}
        >
          <MessageCircle size={18} />
          Bình luận
        </button>
        <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm sm:text-base font-semibold ${
          isDarkMode
            ? 'hover:bg-slate-700 text-white hover:text-cyan-400'
            : 'hover:bg-cyan-100 text-slate-700 hover:text-cyan-600'
        }`}>
          <Share2 size={18} />
          Chia sẻ
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={`px-4 sm:px-6 py-4 border-t transition-colors ${
          isDarkMode
            ? 'bg-gradient-to-b from-slate-700 to-slate-600 border-slate-700'
            : 'bg-gradient-to-b from-blue-50 to-cyan-50 border-slate-200'
        }`}>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className={`flex-1 px-3 py-2 border-2 rounded-lg text-sm focus:outline-none transition ${
                isDarkMode
                  ? 'border-slate-600 bg-slate-800 text-white focus:border-cyan-400 focus:ring-0'
                  : 'border-blue-200 bg-white text-slate-900 focus:border-blue-400'
              }`}
            />
            <button
              onClick={handleAddComment}
              className={`px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600'
              }`}
            >
              Gửi
            </button>
          </div>
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{comments} bình luận</p>
            <div className={`p-3 rounded-lg border-2 text-sm ${
              isDarkMode
                ? 'bg-slate-800 border-slate-600 text-slate-300'
                : 'bg-white border-blue-100 text-slate-600'
            }`}>
              Bình luận sẽ được hiển thị ở đây
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard