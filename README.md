# Web Development Assignment (Frontend + Backend)

This project is built as part of a full-stack web development assignment. It consists of two phases:  
- **Phase 1:** React + Vite frontend with sample data  
- **Phase 2:** Backend with NestJS and integration with frontend  

---

## 🚀 Live Demo
- **Frontend (Vercel):** https://web-development-task-zynpcvsgl.vercel.app/  
- **GitHub Repository:** https://github.com/zynpcvsgl/Web-Development-Assignment  

---

## 📂 Project Structure
```
/project-root
  /frontend   → React + Vite + TypeScript
  /backend    → NestJS + Express + TypeScript
```

---

## 🖥️ Phase 1: Frontend
- Built with **React + TypeScript + Vite**.
- Fetches sample data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
- Displays:
  - User List (id, name, username, email)
  - Post List (userId, id, title)
- Users and Posts support **CRUD operations**.
- Shows relation between Users and Posts via `userId`.
- Code follows **ESLint rules** with no linting errors.
- Deployed on **Vercel**.

### Run locally
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Phase 2: Backend
- Built with **NestJS (Node.js + Express + TypeScript)**.
- Provides **CRUD API** for Users and Posts:
  - Get Users / Posts
  - Create new User / Post
  - Update User / Post
  - Delete User / Post
  - Add Post to a specific User
- Data is **hardcoded inside service files** (no database).
- Frontend can be configured to fetch from this backend instead of JSONPlaceholder.
- Runs on a **separate port** from the frontend.
- Code follows **ESLint rules** with no linting errors.

### Run locally
```bash
cd backend
npm install
npm run start:dev
```

---

## 🌐 Backend Deployment (Optional)

If you want to deploy the backend online, you can use free services like **Render**
### Render Deployment Steps
1. Push your project to GitHub (make sure `/backend` has its own `package.json`).
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `/backend` folder.
4. Set **Build Command**:
   ```bash
   npm install && npm run build
   ```
5. Set **Start Command**:
   ```bash
   npm run start:prod
   ```
6. Define environment variables:
   - `PORT` → `3000` (or any free port)
7. Deploy and use the generated Render URL in your frontend instead of `localhost`.

---

## 📝 Notes
- Each of **frontend** and **backend** has its own `README.md` with setup and run instructions.  
- ESLint is enabled in both projects.  
- Database is **not required** (data is static).  
- Backend deployment is optional; the project can run fully local.  
