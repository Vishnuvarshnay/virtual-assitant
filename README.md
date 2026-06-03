# 🎙️ AI Virtual Assistant with Cloud Integration

[![Live App](https://img.shields.io/badge/Render-Live_Application-green?style=for-the-badge&logo=render)](https://virtual-assitant-ld7b.onrender.com)
[![GitHub Code](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Vishnuvarshnay/virtual-assitant)

An intelligent, voice-enabled digital assistant designed for web automation and media management. This project bridges the gap between **Natural Language Interaction** and **Cloud-based Services**.

---

## 🌐 Live Demo

- **Frontend:** [https://virtual-assitant-ld7b.onrender.com](https://virtual-assitant-ld7b.onrender.com)
- **Backend API:** [https://virtual-assitant-backened-vtwx.onrender.com](https://virtual-assitant-backened-vtwx.onrender.com)

---

## 🚀 Key Technical Highlights

- **Voice Automation Engine:** Integrated Web Speech API (STT) and Speech Synthesis (TTS) to automate tasks like YouTube searches, weather updates, Google searches, and more.
- **AI Brain:** Powered by **Groq API** with `llama-3.3-70b-versatile` for fast, multilingual natural language understanding.
- **Cloud-Native Media Handling:** Implemented **Cloudinary** and **Multer** for secure storage and efficient retrieval of user-generated media assets.
- **Secure Session Management:** Built an authentication system using **JWT** and **cookies** to maintain persistent user context and personalized assistant settings.
- **Persistent Memory:** Chat history stored in MongoDB with a rolling 20-message window for contextual conversations.

---

## 🛠️ Main Features

- **Voice-Driven Web Tasks:** Commands like "Open YouTube", "Search Google for...", "What is the weather in Delhi?" automated via voice.
- **Multilingual Support:** Detects and responds in English, Hindi, Tamil, and more.
- **Cloud Storage Integration:** Real-time profile management and assistant image uploads powered by Cloudinary.
- **Interactive UI/UX:** Responsive, animated interface built for seamless voice interaction.
- **Modular Design:** Clean folder structure for high maintainability and scalability.

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI / NLP | Groq API (LLaMA 3.3 70B) |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Bcrypt, HTTP-only Cookies |
| Media | Cloudinary, Multer |
| Deployment | Render (Frontend + Backend) |

---

## 📁 Project Structure
virtual-assitant/
├── backened/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── groq.js
│   ├── index.js
│   └── .env
└── frontened/
├── src/
│   ├── context/
│   │   └── UserContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Customize.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   └── App.jsx
└── .env

---

## ⚙️ Quick Setup (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Vishnuvarshnay/virtual-assitant.git
cd virtual-assitant
```

### 2. Setup Backend
```bash
cd backened
npm install
```

Create a `.env` file in the `backened/` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=gsk_your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd frontened
npm install
```

Create a `.env` file in the `frontened/` folder:
```env
VITE_SERVER_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
http://localhost:5173

---

## 🔑 Environment Variables (Render Deployment)

Set these in your **Render Dashboard → Environment** for both services:

**Backend service:**
PORT                    = 5000
MONGODB_URI             = mongodb+srv://...
JWT_SECRET              = your_secret
GROQ_API_KEY            = gsk_...
CLOUDINARY_CLOUD_NAME   = ...
CLOUDINARY_API_KEY      = ...
CLOUDINARY_API_SECRET   = ...

**Frontend service:**
VITE_SERVER_URL = https://virtual-assitant-backened-vtwx.onrender.com

---

## 🎤 Supported Voice Commands

| Command | Action |
|---|---|
| "Search for Python tutorials" | Opens Google search |
| "Play Arijit Singh songs" | Opens YouTube |
| "What is the weather in Mumbai?" | Opens weather search |
| "Open Instagram" | Opens Instagram |
| "What time is it?" | Speaks current time |
| "What is today's date?" | Speaks current date |
| "Open calculator" | Opens Google calculator |


