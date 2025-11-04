# VAT Management System - Fullstack (Backend + Frontend)

## 🚀 Features

### Backend (Express + MongoDB)
- Express REST API with JWT authentication
- MongoDB database with Mongoose ODM
- User authentication (register/login) with bcrypt password hashing
- File upload with Multer (VAT documents)
- File validation (type & size)
- CORS enabled for frontend integration
- Google Drive integration (optional)
- Telegram notifications (optional)

### Frontend (React + Vite)
- Modern React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React icons
- Responsive design
- Authentication UI (Login/Register)

## 📁 Project Structure
```
vat-backend-complete/
├── server.js              # Backend entry point
├── src/                   # Backend source code
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Utilities (Drive, Telegram)
├── client-app/           # Frontend React app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Frontend utilities
│   └── .env             # Frontend environment variables
├── uploads/              # Uploaded files directory
├── docker-compose.yml    # Docker Compose configuration
└── .env                  # Backend environment variables
```

## 🛠️ Installation & Setup

### Option 1: Docker Compose (Khuyên dùng)

1. **Cấu hình environment:**
   ```bash
   # Copy và chỉnh sửa file .env
   cp .env.example .env
   ```

2. **Chạy Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Truy cập:**
   - **Backend API:** http://localhost:4000
   - **Frontend:** http://localhost:3000
   - **MongoDB:** localhost:27017

### Option 2: Manual Setup (Development)

#### Backend
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   - Copy `.env.example` to `.env`
   - Fill in MongoDB URI, JWT secret, etc.

3. **Start backend:**
   ```bash
   npm run dev     # Development with nodemon
   # or
   npm start       # Production
   ```

#### Frontend
1. **Navigate to frontend:**
   ```bash
   cd client-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend:**
   ```bash
   npm run dev
   ```

Frontend sẽ chạy trên: http://localhost:3000

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Đăng ký user mới (email, password)
- `POST /api/auth/login` — Đăng nhập → trả về JWT token

### VAT Management (Protected - cần JWT token)
- `POST /api/vat/upload` — Upload file VAT
- `GET /api/vat` — Danh sách tất cả VAT files
- `GET /api/vat/:id` — Chi tiết VAT file
- `PUT /api/vat/:id/publish` — Đánh dấu published và push lên Drive/Telegram

### Static Files
- `GET /uploads/*` — Truy cập file đã upload

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/vatdb
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Optional: Google Drive
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Optional: Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Frontend (client-app/.env)
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=VAT Management System
```

## 🐳 Docker Services

Docker Compose bao gồm 3 services:
- **backend**: Node.js Express API (port 4000)
- **frontend**: React Vite app (port 3000)
- **mongo**: MongoDB database (port 27017)

## 📝 Development Notes

- Backend chạy với nodemon để auto-reload
- Frontend có hot-reload với Vite
- CORS đã được cấu hình cho phép frontend gọi API
- MongoDB data được persist trong Docker volume

## 🔄 Workflow

1. User register/login qua frontend
2. Frontend nhận JWT token và lưu vào localStorage
3. User upload VAT files
4. Backend validate và lưu file
5. Optional: Auto-upload lên Google Drive
6. Optional: Gửi notification qua Telegram

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- bcrypt (password hashing)
- CORS

**Frontend:**
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

## 🆘 Troubleshooting

**Port đã được sử dụng:**
```bash
# Thay đổi port trong .env (backend) hoặc client-app/.env (frontend)
```

**MongoDB connection error:**
```bash
# Đảm bảo MongoDB đang chạy hoặc dùng Docker Compose
docker-compose up mongo
```

**CORS errors:**
```bash
# Đảm bảo VITE_API_URL trong client-app/.env đúng với backend URL
```

## 📚 Additional Documentation

Xem thêm tài liệu trong `client-app/`:
- `API_INTEGRATION.md` - Hướng dẫn tích hợp API
- `DEPLOYMENT.md` - Hướng dẫn deploy
- `INSTALLATION.md` - Chi tiết cài đặt frontend
- `QUICK_START.md` - Quick start guide

---

Made with ❤️ by VAT Management Team

