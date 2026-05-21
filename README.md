# 📚 CourseHub — Online Learning Platform

A full-stack online learning platform where **Instructors** publish video courses, **Students** enroll and learn, and **Admins** manage everything from a dashboard.

**Live Links**

| Layer    | URL |
|----------|-----|
| Frontend | https://online-learning-platform-livid.vercel.app |
| Backend  | https://online-learning-platform-aqix.onrender.com |

---

## 🧰 Tech Stack

| Area      | Technologies |
|-----------|-------------|
| Frontend  | React 19, Vite, Tailwind CSS 4, React Router 7, Axios, Recharts, Swiper, React Hook Form, React Hot Toast, React Icons, Zustand |
| Backend   | Node.js, Express 5, Mongoose (MongoDB), JWT, Bcrypt, Cloudinary, Multer, Cookie-Parser, CORS |
| Database  | MongoDB (Atlas in production, localhost in dev) |
| Media     | Cloudinary (image thumbnails + video lectures) |
| Hosting   | Vercel (frontend) · Render (backend) |

---

## 📁 Folder Structure

```
Online-Learning-Platform/
│
├── frontend/                    # React + Vite app
│   └── src/
│       ├── api/                 # Axios instance (base URL config)
│       ├── components/          # Shared UI — Header, Footer, CourseCard, HeroSlider
│       ├── layouts/             # RootLayout (wraps all pages with Header + Footer)
│       ├── pages/               # Public pages — Home, Login, Register
│       ├── routes/              # ProtectedRoute & PublicRoute guards
│       ├── student/             # Student pages — Dashboard, AllCourses, CourseDetails, CourseContent, MyCourses, Checkout, Profile
│       ├── instructor/          # Instructor pages — Dashboard, CreateCourse, EditCourse, MyCourses, Analytics, Reviews, Profile
│       ├── admin/               # Admin pages — Dashboard, Users, Courses, Analytics, Settings
│       ├── config.js            # Switches API base URL between localhost and Render
│       └── App.jsx              # All routes defined here
│
├── backend/                     # Express API server
│   ├── APIs/
│   │   ├── commonAPI.js         # Register, Login, Logout
│   │   ├── userAPI.js           # Student endpoints — courses, enroll, progress, reviews
│   │   ├── instructorAPI.js     # Instructor endpoints — create/edit/delete courses, Cloudinary uploads
│   │   └── adminAPI.js          # Admin endpoints — stats, manage users & courses
│   ├── middlewares/
│   │   ├── verifyToken.js       # JWT cookie auth + role-based authorization
│   │   └── multer.js            # File upload handling (temp storage before Cloudinary)
│   ├── models/
│   │   ├── User.js              # User schema (Student / Instructor / Admin)
│   │   ├── Course.js            # Course schema (sections → lectures, reviews, ratings)
│   │   └── CourseProgress.js    # Tracks which lectures each student has completed
│   ├── utils/
│   │   └── cloudinary.js        # Cloudinary config + upload helper
│   ├── server.js                # App entry — Express setup, CORS, DB connect
│   └── .env                     # Environment variables (not committed to Git)
│
└── README.md                    # You are here
```

---

## 👤 User Roles & What They Can Do

### 🎓 Student
- Register and log in
- Browse all available courses (filter by level, category, search)
- View course details (description, sections, lectures, reviews, pricing)
- Enroll in free courses directly or purchase paid courses via checkout
- Watch video lectures in a dedicated learning player
- Track progress per course (lectures completed, percentage)
- Mark lectures as complete (auto-marks when video finishes)
- Write reviews and star ratings for enrolled courses
- Take personal notes per lecture (saved in browser)
- View profile with enrolled courses and stats

### 🧑‍🏫 Instructor
- Register and log in as Instructor
- Create new courses (title, description, category, level, price, thumbnail image)
- Edit existing courses (update details, add/remove sections and lectures)
- Upload lecture videos directly to Cloudinary with real-time progress bar
- View a personal dashboard with stats (total students, revenue, average rating)
- See revenue charts (last 6 months) and category distribution
- View analytics per course (completion rates, drop-off per lecture, student leaderboard)
- Read all student reviews across courses from a single page
- Browse the full platform catalog to see what other instructors have published
- Manage profile

### 🛡️ Admin
- View a master dashboard with platform-wide stats
- Manage all users (view, activate/deactivate accounts)
- Manage all courses (view, activate/deactivate courses)
- View platform analytics
- Update account settings

---

## 🔧 How It Works — Step by Step

### Authentication Flow
1. User goes to `/register` → fills the form → backend hashes the password with bcrypt → saves to MongoDB
2. User goes to `/login` → backend verifies credentials → creates a **JWT token** → sends it as an **httpOnly cookie**
3. Every subsequent API request includes this cookie automatically (`withCredentials: true` in Axios)
4. The `verifyToken` middleware on the backend reads the cookie, verifies the JWT, and attaches the user info to the request
5. The `authorizeRole` middleware checks if the user's role matches what the route requires (e.g., STUDENT, INSTRUCTOR, ADMIN)
6. On the frontend, `ProtectedRoute` checks `localStorage` for the user object and redirects to login if not found

### Course Publishing Flow (Instructor)
1. Instructor clicks "Create Course" → fills in title, description, category, level, price
2. Optionally uploads a thumbnail image → sent as `multipart/form-data` to the backend
3. Backend receives the image via Multer → uploads it to **Cloudinary** → saves the Cloudinary URL in MongoDB
4. Course is created with empty sections → Instructor goes to "Edit Course"
5. In the Curriculum Editor, instructor adds **Sections** (e.g., "React Basics")
6. Inside each section, instructor adds **Lectures** by providing a title and selecting a video file
7. **Video upload works like this:**
   - Frontend requests a **signed upload signature** from the backend (`/generate-upload-signature`)
   - Backend generates a cryptographic signature using the Cloudinary API secret
   - Frontend uploads the video **directly from the browser to Cloudinary** (bypasses the backend to avoid timeout on large files)
   - Upload progress is tracked in real-time with an XHR progress bar
   - Once Cloudinary returns the secure video URL, frontend sends it to the backend to save in the database

### Student Learning Flow
1. Student browses `/all-courses` → can search, filter by level/category, sort by newest/popular/rating
2. Clicks on a course → sees full details, sections, lectures, reviews, pricing
3. For **free courses**: clicks "Enroll for Free" → backend adds the course to their enrolled list
4. For **paid courses**: clicks "Buy Now" → goes to `/checkout/:courseId` → completes payment → enrolled
5. After enrollment, clicks "Start Learning" → opens the **Course Player** (`/learn/:courseId`)
6. Course Player shows:
   - Video player on the left (streams from Cloudinary CDN)
   - Curriculum sidebar on the right (all sections and lectures with completion status)
   - Navigation buttons (Previous / Next lecture)
   - Tabs below the video: Overview, Notes, Reviews
7. When a video finishes playing, the lecture is **automatically marked as complete** (synced to backend)
8. Student can also manually toggle lecture completion
9. Progress percentage updates in real-time across all views (player, course details, sidebar)
10. Student can write a review with star rating after enrolling

### Admin Management Flow
1. Admin logs in → redirected to `/admin-dashboard`
2. Can see platform-wide stats (total users, courses, enrollments, revenue)
3. Can view and manage all users — activate or deactivate accounts
4. Can view and manage all courses — activate or deactivate courses
5. Can view analytics with charts
6. Can update personal settings

---

## 🗄️ Database Models

### User
| Field           | Type     | Notes |
|----------------|----------|-------|
| firstName      | String   | Required |
| lastName       | String   | Required |
| email          | String   | Required, unique |
| password       | String   | Hashed with bcrypt, min 6 chars |
| role           | String   | STUDENT, INSTRUCTOR, or ADMIN |
| isActive       | Boolean  | Default: true (admin can deactivate) |
| profilePic     | String   | URL |
| coursesEnrolled| ObjectId[]| References to Course documents |

### Course
| Field           | Type     | Notes |
|----------------|----------|-------|
| title          | String   | Required |
| description    | String   | Required |
| category       | String   | Required (e.g., Development, Design) |
| courseLevel    | String   | Beginner, Intermediate, or Advanced |
| price          | Number   | Default: 0 (free) |
| instructor     | ObjectId | Reference to User |
| studentsEnrolled| Number  | Counter |
| rating         | Number   | Computed average |
| ratingCount    | Number   | Total number of ratings |
| thumbnail      | String   | Cloudinary URL |
| isActive       | Boolean  | Admin can deactivate |
| sections       | Array    | Each section has a title and an array of lectures |
| reviews        | Array    | Each review has user, rating (1-5), review text, timestamp |

### Lecture (embedded in Section)
| Field       | Type    | Notes |
|------------|---------|-------|
| title      | String  | Required |
| description| String  | Optional |
| videoUrl   | String  | Cloudinary URL, required |
| duration   | String  | In seconds |
| isPreview  | Boolean | Whether non-enrolled users can watch |

### CourseProgress
| Field             | Type      | Notes |
|-------------------|-----------|-------|
| user              | ObjectId  | Reference to User |
| course            | ObjectId  | Reference to Course |
| completedLectures | ObjectId[]| IDs of completed lecture sub-documents |
| lastAccessed      | Date      | Auto-updated |

> A unique index on `(user, course)` ensures one progress record per student per course.

---

## 🌐 API Routes Overview

### Common API (`/common-api`)
| Method | Endpoint    | Description |
|--------|------------|-------------|
| POST   | `/register` | Create a new user account |
| POST   | `/login`    | Authenticate and receive a cookie |
| POST   | `/logout`   | Clear the auth cookie |

### User/Student API (`/user-api`)
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/courses`             | Get all courses |
| GET    | `/course/:id`          | Get single course details |
| GET    | `/my-courses`          | Get courses the student is enrolled in |
| POST   | `/enroll-course`       | Enroll in a course |
| GET    | `/progress/:courseId`  | Get lecture completion progress |
| POST   | `/progress/:courseId/:lectureId` | Toggle a lecture's completion |
| POST   | `/review/:courseId`    | Submit a review |
| GET    | `/profile`             | Get user profile |

### Instructor API (`/instructor-api`)
| Method | Endpoint                           | Description |
|--------|------------------------------------|-------------|
| GET    | `/generate-upload-signature`       | Get signed params for Cloudinary upload |
| POST   | `/create-course`                   | Create a new course (with thumbnail) |
| GET    | `/my-courses`                      | Get instructor's own courses |
| GET    | `/course/:id`                      | Get single course (ownership check) |
| PUT    | `/update-course/:id`               | Update course details |
| DELETE | `/delete-course/:id`               | Delete a course |
| POST   | `/add-section/:courseId`           | Add a section to a course |
| PUT    | `/update-section/:courseId/:sectionId` | Update section title |
| DELETE | `/delete-section/:courseId/:sectionId` | Delete a section |
| POST   | `/add-lecture/:courseId/:sectionId` | Add a lecture (with Cloudinary video URL) |
| DELETE | `/delete-lecture/:courseId/:sectionId/:lectureId` | Delete a lecture |
| GET    | `/dashboard-stats`                 | Get revenue, students, ratings overview |
| GET    | `/analytics/:courseId`             | Get per-course analytics |
| GET    | `/global-reviews-analytics`        | Get all reviews across courses |

### Admin API (`/admin-api`)
| Method | Endpoint                    | Description |
|--------|-----------------------------|-------------|
| GET    | `/stats`                    | Platform-wide statistics |
| GET    | `/courses`                  | All courses with management info |
| PATCH  | `/courses/:id/status`       | Activate/deactivate a course |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string
- A Cloudinary account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/PURUSHOTHAM-spr/Online-Learning-Platform.git
cd Online-Learning-Platform
```

### 2. Set up the Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGO_URL=mongodb://localhost:27017/online-learning-platform
PORT=3000
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Start the backend:
```bash
npm start
```
The server runs on `http://localhost:3000`.

### 3. Set up the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
The app runs on `http://localhost:5173`.

---

## ☁️ Deployment Notes

### Frontend (Vercel)
- The frontend auto-detects the environment using `window.location.hostname`
- On localhost → API calls go to `http://localhost:3000`
- On Vercel → API calls go to `https://online-learning-platform-aqix.onrender.com`
- This logic lives in `frontend/src/config.js`

### Backend (Render)
- Make sure these environment variables are set in Render dashboard:
  - `MONGO_URL` — Your MongoDB Atlas connection string
  - `PORT` — Render sets this automatically
  - `JWT_SECRET` — A strong random string
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `NODE_ENV=production` — **Important!** This enables secure cross-site cookies

### Cross-Origin Cookies
- Since frontend (Vercel) and backend (Render) are on different domains, cookies need special config
- The backend sets cookies with `secure: true` and `sameSite: 'none'` in production
- CORS is configured to allow the Vercel origin with `credentials: true`

---

## 📝 Key Design Decisions

1. **Cookie-based auth over token headers** — JWT is stored in an httpOnly cookie (not localStorage) to prevent XSS attacks
2. **Direct-to-Cloudinary video upload** — Videos upload from the browser directly to Cloudinary using signed requests, avoiding backend timeouts on Render's free tier
3. **Backend-mediated thumbnail upload** — Thumbnail images are small, so they go through the backend via Multer → Cloudinary
4. **Progress tracking in MongoDB** — Each student has a `CourseProgress` document per course, tracking completed lecture IDs
5. **Role-based route protection** — Both frontend (ProtectedRoute component) and backend (verifyToken + authorizeRole middleware) enforce access control
