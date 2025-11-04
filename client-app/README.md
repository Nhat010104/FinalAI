# n8n - Nền tảng Tự động hóa

Một ứng dụng web hiện đại về n8n được xây dựng bằng **React** với các tính năng đăng nhập/đăng ký và feed bài viết. Ứng dụng này hoạt động hoàn hảo trên cả **web và mobile**.

## 📋 Tính năng

- ✅ **Xác thực người dùng**: Đăng nhập và đăng ký tài khoản
- ✅ **Feed bài viết**: Hiển thị bài viết mới nhất trước
- ✅ **Tạo bài viết**: Người dùng có thể tạo bài viết mới với tiêu đề, nội dung và hình ảnh
- ✅ **Tương tác**: Thích, bình luận, và chia sẻ bài viết
- ✅ **Tìm kiếm**: Tìm kiếm bài viết theo tiêu đề hoặc nội dung
- ✅ **Responsive Design**: Hoạt động tuyệt vời trên desktop, tablet và mobile
- ✅ **UI hiện đại**: Sử dụng Tailwind CSS cho giao diện đẹp

## 🛠️ Công nghệ sử dụng

- **React 18** - Thư viện UI
- **React Router DOM v6** - Định tuyến
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **JavaScript ES6+**

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js phiên bản 14.0.0 trở lên
- npm hoặc yarn

### Các bước cài đặt

1. **Điều hướng đến thư mục dự án:**
   ```bash
   cd "n8n-app"
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy ứng dụng ở chế độ development:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ tự động mở ở `http://localhost:3000`

4. **Build cho production:**
   ```bash
   npm run build
   ```

5. **Xem preview build:**
   ```bash
   npm run preview
   ```

## 📁 Cấu trúc thư mục

```
n8n-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Thanh điều hướng
│   │   ├── PostCard.jsx       # Component hiển thị bài viết
│   │   └── CreatePost.jsx     # Form tạo bài viết mới
│   ├── pages/
│   │   ├── Login.jsx          # Trang đăng nhập
│   │   ├── Register.jsx       # Trang đăng ký
│   │   └── Feed.jsx           # Trang feed chính
│   ├── App.jsx                # Component chính
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── public/
├── index.html                 # HTML chính
├── vite.config.js             # Cấu hình Vite
├── tailwind.config.js         # Cấu hình Tailwind
├── postcss.config.js          # Cấu hình PostCSS
├── package.json               # Dependencies
└── README.md                  # File này
```

## 🎯 Hướng dẫn sử dụng

### Đăng nhập / Đăng ký
- Nhấp vào nút "Đăng ký ngay" để tạo tài khoản mới
- Sau khi đăng ký thành công, bạn sẽ được chuyển hướng đến feed
- Sử dụng tài khoản đã tạo để đăng nhập

### Tương tác với bài viết
- **Thích**: Nhấp vào icon trái tim để thích bài viết
- **Bình luận**: Nhấp vào nút "Bình luận" để viết bình luận
- **Chia sẻ**: Nhấp vào nút "Chia sẻ" để chia sẻ bài viết

### Tạo bài viết
- Nhấp vào nút "Tạo bài viết mới"
- Điền tiêu đề, nội dung, và URL hình ảnh (tùy chọn)
- Nhấp "Đăng bài" để yêu cầu bài viết

### Tìm kiếm
- Sử dụng thanh tìm kiếm ở đầu trang để tìm bài viết

## 📱 Responsive Design

Ứng dụng được thiết kế để hoạt động trên tất cả các kích thước màn hình:
- **Desktop**: Layout đầy đủ với tất cả các tính năng
- **Tablet**: Điều chỉnh kích thước cho trình duyệt tablet
- **Mobile**: Giao diện được tối ưu hóa hoàn toàn cho điện thoại di động

## 🔐 Bảo mật

- Dữ liệu người dùng được lưu trong `localStorage` (cho mục đích demo)
- Trong production, bạn nên sử dụng backend server và JWT tokens
- Mật khẩu cần ít nhất 6 ký tự

## 📝 Ghi chú

Đây là phiên bản demo với dữ liệu được mô phỏng. Để sử dụng trong production:

1. Kết nối với backend API
2. Thêm xác thực thực sự (JWT, OAuth, v.v.)
3. Sử dụng cơ sở dữ liệu thực
4. Thêm xử lý lỗi toàn diện
5. Thêm unit tests
6. Cấu hình HTTPS

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
- Node.js đã được cài đặt chính xác
- Tất cả dependencies đã được cài đặt (`npm install`)
- Port 3000 không bị sử dụng bởi ứng dụng khác

## 📄 License

Dự án này được tạo ra cho mục đích giáo dục.

---

**Chúc mừng bạn! 🎉 Ứng dụng n8n của bạn đã sẵn sàng để chạy!**