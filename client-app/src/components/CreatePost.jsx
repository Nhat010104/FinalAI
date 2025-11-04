import { useState } from 'react'
import { Image, X } from 'lucide-react'

function CreatePost({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Vui lòng điền tiêu đề và nội dung')
      return
    }

    onSubmit(formData)
    setFormData({ title: '', content: '', image: '' })
    setError('')
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border-2 border-gradient-to-r from-purple-300 to-pink-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Tạo bài viết mới</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-purple-100 rounded-lg transition-colors text-gray-600 hover:text-purple-600"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề bài viết..."
            className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm sm:text-base transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nội dung
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            rows="5"
            className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm sm:text-base resize-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL hình ảnh (tùy chọn)
          </label>
          <div className="relative">
            <Image className="absolute left-3 top-3 text-purple-400" size={20} />
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full pl-10 pr-4 py-2.5 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm sm:text-base transition"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Đăng bài
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost