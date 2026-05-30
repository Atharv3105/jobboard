# 💼 JobBoard — Full-Stack Job Board Application

A complete job board website built with **React**, **Node.js**, and **MongoDB**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod` service)

### 1. Install Dependencies

Open **two terminal windows** in `c:\CodSoft`:

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
```

### 2. Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 📁 Project Structure

```
c:\CodSoft\
├── server/          # Node.js + Express API
│   ├── config/      # DB connection, email service
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth, error handler, file upload
│   ├── models/      # MongoDB schemas (User, Job, Application)
│   ├── routes/      # API routes
│   ├── uploads/     # Uploaded resumes
│   └── server.js    # Entry point
│
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Navbar, JobCard, Footer, ProtectedRoute
│   │   ├── context/     # AuthContext (JWT)
│   │   ├── pages/       # All page components
│   │   └── services/    # API calls (axios)
│   └── vite.config.js
│
└── netlify.toml     # Deployment config
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Home page with featured jobs | ✅ |
| Job listings with search & filters | ✅ |
| Job detail page | ✅ |
| Employer dashboard (post/edit/delete jobs) | ✅ |
| Candidate dashboard (profile + applications) | ✅ |
| Job application form with resume upload | ✅ |
| Email notifications (demo/console mode) | ✅ |
| JWT authentication & security | ✅ |
| Mobile responsive design | ✅ |
| Dark mode design | ✅ |
| Role-based access (employer/candidate) | ✅ |
| Pagination | ✅ |
| Application status tracking | ✅ |

---

## 🔐 Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com    # Optional for real emails
EMAIL_PASS=your_app_password       # Optional for real emails
NODE_ENV=development
```

---

## 🌐 Deployment

### Frontend → Netlify
1. Push `client/` to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish dir: `dist`

### Backend → Render.com
1. Push `server/` to GitHub
2. Connect to Render (free tier)
3. Set environment variables in Render dashboard
4. Update CORS origin in `server.js` with Netlify URL

---

## 🧪 Test Flow
1. Register as **Employer** → Post a job → View in listings
2. Register as **Candidate** → Search jobs → Apply → Check dashboard
3. As Employer → View applicants → Update status
4. Check console for email notifications (demo mode)
