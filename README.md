<div align="center">

# 🩺 Appointy

**A production-grade doctor appointment platform built for scale, security, and real-world use.**

![Node.js](https://img.shields.io/badge/Node.js-v24-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

[Live Demo](#) · [API Docs](#api-overview) · [Screenshots](#screenshots)

</div>

---

## ⚡ Highlights

| | Feature | Detail |
|---|---------|--------|
| 🔐 | **Role-Based Auth** | JWT with `{ id, role, exp }` — unified `Bearer` token for all roles |
| 🛡️ | **Double-Booking Prevention** | MongoDB partial unique index on active appointments |
| 📊 | **Admin Dashboard** | Live stats, doctor CRUD, appointment management |
| 🎨 | **Premium UI** | Glassmorphism, gradient CTAs, skeleton loaders, micro-animations |
| ⚙️ | **Production Config** | Env validation at startup, rate limiting, Helmet security headers |
| 📱 | **Fully Responsive** | Mobile-first design with slide-in menus and adaptive layouts |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · Vite · Tailwind CSS · React Router v7 · Axios |
| **Backend** | Node.js · Express 5 · Mongoose ODM |
| **Database** | MongoDB Atlas (cloud) |
| **Auth** | JWT (bcrypt + Bearer tokens) |
| **Storage** | Cloudinary (image uploads) |
| **Security** | Helmet · express-rate-limit · CORS · input validation |

---

## 🔄 Application Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Browse   │────▶│  Select  │────▶│  Book    │────▶│  Manage  │
│  Doctors  │     │  Doctor  │     │  Slot    │     │  Appts   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
  Filter by       View profile     Pick date +     Cancel /
  specialty       & fees           time slot       Complete
```

---

## 👥 Roles & Access

| Action | Patient | Doctor | Admin |
|--------|:-------:|:------:|:-----:|
| Register / Login | ✅ | ✅ | ✅ |
| Browse doctors | ✅ | ✅ | ✅ |
| Book appointment | ✅ | — | — |
| Cancel own appointment | ✅ | — | — |
| View own appointments | ✅ | ✅ | — |
| Complete appointment | — | ✅ | — |
| Add / Edit / Delete doctors | — | — | ✅ |
| Toggle doctor availability | — | — | ✅ |
| Cancel any appointment | — | — | ✅ |
| View dashboard stats | — | — | ✅ |
| Manage all users | — | — | ✅ |

---

## 📁 Project Structure

```
Appointy/
├── backend/
│   ├── src/
│   │   ├── config/          # env, db, cloudinary
│   │   ├── constants/       # roles, statuses, time slots
│   │   ├── controllers/     # auth, user, doctor, appointment, admin
│   │   ├── middleware/      # auth, validate, errorHandler, upload
│   │   ├── models/          # User, Doctor, Appointment
│   │   ├── routes/          # RESTful route definitions
│   │   ├── utils/           # AppError, catchAsync, apiResponse
│   │   └── app.js           # Express configuration
│   ├── server.js            # Entry point + graceful shutdown
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API service layer
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Card, Modal, Skeleton...
│   │   │   ├── layout/      # Navbar, Footer, AdminSidebar, ProtectedRoute
│   │   │   └── doctors/     # DoctorCard, DoctorFilters
│   │   ├── context/         # AuthContext (JWT + role state)
│   │   ├── hooks/           # useAuth, useFetch
│   │   ├── pages/           # Landing, Login, Doctors, Dashboard...
│   │   │   └── admin/       # AdminDashboard, AdminDoctors, AdminUsers...
│   │   └── App.jsx          # Route tree with nested layouts
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/yourusername/appointy.git && cd appointy

# 2. Backend
cd backend
cp .env.example .env        # fill in your values
npm install
npm run dev                  # → http://localhost:8000

# 3. Frontend (new terminal)
cd frontend
echo "VITE_BACKEND_URL=http://localhost:8000" > .env
npm install
npm run dev                  # → http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Token signing key | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token TTL | `7d` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `SecurePass123` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdef...` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:8000` |

---

## 📡 API Overview

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/register` | — | Register patient |
| `POST` | `/login` | — | Patient login |
| `POST` | `/doctor/login` | — | Doctor login |
| `POST` | `/admin/login` | — | Admin login |

### Doctors — `/api/doctors`
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/` | — | List + search + filter + paginate |
| `GET` | `/:id` | — | Doctor details |
| `GET` | `/me/profile` | 🩺 | Own profile |
| `PUT` | `/me/profile` | 🩺 | Update profile |

### Appointments — `/api/appointments`
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/` | 👤 | Book appointment |
| `GET` | `/my` | 👤 | List own appointments |
| `PATCH` | `/:id/cancel` | 👤 | Cancel appointment |
| `GET` | `/doctor` | 🩺 | Doctor's appointments |
| `PATCH` | `/:id/complete` | 🩺 | Mark completed |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/dashboard` | 🔑 | Stats overview |
| `POST` | `/doctors` | 🔑 | Add doctor |
| `PUT` | `/doctors/:id` | 🔑 | Update doctor |
| `DELETE` | `/doctors/:id` | 🔑 | Delete doctor |
| `GET` | `/appointments` | 🔑 | All appointments |
| `GET` | `/users` | 🔑 | All users |

> 👤 Patient &nbsp;·&nbsp; 🩺 Doctor &nbsp;·&nbsp; 🔑 Admin

---

## 📸 Screenshots

<!-- Replace these with actual screenshots -->

| Page | Preview |
|------|---------|
| **Landing Page** | `[Screenshot]` |
| **Doctor Listing** | `[Screenshot]` |
| **Booking Flow** | `[Screenshot]` |
| **User Dashboard** | `[Screenshot]` |
| **Admin Dashboard** | `[Screenshot]` |
| **Login Page** | `[Screenshot]` |

---

## 🏆 Key Achievements

- [x] **Zero duplicate bookings** — enforced at database level with partial unique index
- [x] **Unified auth system** — single `Bearer` token pattern across all 3 roles  
- [x] **Fail-fast config** — server refuses to start with missing env vars
- [x] **Centralized error handling** — custom `AppError` class + global error middleware
- [x] **State-machine appointments** — `pending → completed` or `pending → cancelled` only
- [x] **30-file frontend** — clean component architecture, zero code duplication
- [x] **Rate limiting** — 100 req/15min general, 20 req/15min for auth endpoints
- [x] **Full RBAC** — middleware-enforced role checks on every protected route

---

## 🔮 Future Improvements

| Feature | Status |
|---------|--------|
| Payment integration (Razorpay/Stripe) | 🔜 Planned |
| Email/SMS notifications | 🔜 Planned |
| Doctor availability calendar | 🔜 Planned |
| Video consultation | 💡 Idea |
| PWA + push notifications | 💡 Idea |

---

<div align="center">

Built with ☕ and clean code.

**[⬆ Back to Top](#-appointy)**

</div>
