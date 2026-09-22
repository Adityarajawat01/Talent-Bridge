# TalentBridge

**TalentBridge** is a full-stack recruitment platform that connects **job seekers and recruiters** through a modern web application.

The platform allows candidates to discover and apply for jobs, while recruiters can create companies, publish job openings, manage applications, communicate with candidates, and conduct real-time video calls.

The project is built with a **React + Node.js + MongoDB** stack, with the frontend and backend maintained as separate applications inside a single repository.

---

## 🚀 Features

### 👨‍💻 Job Seeker

* User registration and login
* Protected routes and authentication
* Browse available jobs
* Search and explore job listings
* View detailed job descriptions
* Apply for jobs
* Track application status
* Manage user profile
* Upload profile images
* Real-time chat with recruiters
* Video calling support

### 🏢 Recruiter

* Recruiter authentication
* Create and manage companies
* Create, edit, and delete job listings
* View applicants for posted jobs
* Review candidate applications
* Manage recruiter profile
* Communicate with candidates through real-time chat
* Initiate real-time video calls

### 💬 Communication

* Real-time messaging using **Socket.IO**
* Real-time call signaling using **Socket.IO**
* Video calling using **WebRTC client flows**
* Media upload using **Cloudinary**

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* React Router
* Redux Toolkit
* Redux Persist
* Tailwind CSS
* Axios
* Socket.IO Client
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* HTTP Cookies
* Socket.IO
* Multer
* Cloudinary

### Real-Time Communication

* Socket.IO
* WebRTC
* STUN/TURN-compatible WebRTC configuration

### Deployment

* Render
* MongoDB Atlas
* Cloudinary

---

## 📂 Project Structure

```text
TalentBridge/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── socket/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── vite.config.js
│
├── render.yaml
└── README.md
```

---

## 🔄 Application Flow

```text
                    TalentBridge
                         │
             ┌───────────┴───────────┐
             │                       │
        Job Seeker                Recruiter
             │                       │
       Browse Jobs             Create Company
             │                       │
       Apply for Job            Post Jobs
             │                       │
       Track Application        Review Applicants
             │                       │
             └───────────┬───────────┘
                         │
                    Communication
                         │
                ┌────────┴────────┐
                │                 │
             Chat             Video Call
                │                 │
           Socket.IO      Socket.IO + WebRTC
```

---

## 📋 Requirements

Before running the project locally, make sure you have:

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas
* Cloudinary account

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Adityarajawat01/Talent-Bridge.git

cd Talent-Bridge
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# 🔐 Environment Variables

## Backend

Create a file:

```text
backend/.env
```

Add:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

SECRET_KEY=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

## Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> **Important:** Never commit `.env` files, API keys, database credentials, or other secrets to GitHub.

---

# ▶️ Running the Application

Open two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

The backend will normally run on:

```text
http://localhost:3000
```

Health endpoint:

```text
http://localhost:3000/home
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 📜 Available Scripts

## Backend

```bash
npm run dev
```

Starts the backend using Nodemon.

```bash
npm start
```

Starts the backend using Node.js.

## Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint.

---

# 🔌 API Structure

The backend API is organized under:

```text
/api/v1
```

### User

```text
/api/v1/user
```

Authentication, user profiles, and user-related operations.

### Company

```text
/api/v1/company
```

Recruiter company management.

### Jobs

```text
/api/v1/job
```

Job creation, retrieval, updating, and management.

### Applications

```text
/api/v1/application
```

Job applications and application management.

### Chat

```text
/api/v1/chat
```

Conversations and messages.

---

# 💬 Real-Time Chat

TalentBridge uses **Socket.IO** for real-time communication.

The basic communication flow is:

```text
User A
   │
   │ Socket.IO
   ▼
Backend Socket Server
   │
   │ Socket.IO
   ▼
User B
```

This allows messages and call-related events to be delivered without repeatedly refreshing the page.

---

# 📹 Video Calling

TalentBridge also contains a WebRTC-based video calling flow.

The responsibilities are separated:

```text
Socket.IO
     │
     ├── Call request
     ├── Call accepted/rejected
     ├── SDP offer
     ├── SDP answer
     └── ICE candidates
     
WebRTC
     │
     ├── Camera
     ├── Microphone
     ├── Peer connection
     └── Audio/Video streaming
```

**Socket.IO is used for signaling**, while **WebRTC handles the peer-to-peer media connection**.

---

# ☁️ Deployment

The project includes:

```text
render.yaml
```

which is configured for separate frontend and backend deployments.

### Backend Environment Variables

Configure the following variables in Render:

```text
MONGO_URI
SECRET_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Frontend Environment Variable

Configure:

```text
VITE_API_BASE_URL
```

with the deployed backend URL.

Also make sure the backend CORS configuration allows requests from the deployed frontend.

---

# 🔮 Future Improvements

Potential improvements include:

* Advanced job recommendation system
* Resume parsing and analysis
* AI-powered candidate matching
* Email notifications
* Interview scheduling
* Advanced recruiter analytics
* Candidate filtering and sorting
* Online interview history
* Improved video-call reliability with TURN infrastructure
* Automated deployment pipeline
* Automated testing

---

# 🤝 Contributing

Contributions are welcome.

1. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

2. Make your changes.

3. Test the changes.

4. Run lint/build checks where applicable.

5. Commit your changes.

```bash
git commit -m "Add your feature"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

# 📄 License

This project currently does not specify a license.

---

## 👨‍💻 Author

**Aditya Singh**

Full Stack Developer | MERN Stack

GitHub:
https://github.com/Adityarajawat01

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
