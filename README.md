# Internal Project Management System (Real-Time Collaboration)

This is a full-stack Internal Project Management System built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time collaboration. It was built as part of an interview assignment to demonstrate clean architecture, real-time functionality, and modern UI design.

## Features
- **Real-Time Task Updates**: Tasks moved across the board are instantly synced across all connected clients via Socket.IO.
- **Glassmorphism UI**: A premium, modern, dark-mode interface built purely with Vanilla CSS (no Tailwind).
- **Authentication**: JWT-based secure authentication for both REST APIs and WebSocket connections.
- **Project Dashboard**: Manage multiple projects seamlessly.

## Architecture & System Design
- **Frontend**: React (Vite), Context API (Auth & Socket state).
- **Backend**: Node.js, Express, Socket.IO.
- **Database**: MongoDB (Mongoose).
- **Pattern**: The backend follows a strict Controller-Service-Route architecture to keep business logic decoupled and scalable.

## API Documentation

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Project Routes (Protected)
- `GET /api/projects` - Get all projects for logged-in user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details and its tasks

### Task Routes (Protected)
- `POST /api/projects/:projectId/tasks` - Create a new task in a project
- `PUT /api/tasks/:id` - Update a task (e.g., status change)
- `DELETE /api/tasks/:id` - Delete a task

## Socket.IO Events
- **`join_project`**: Client joins a specific project room.
- **`leave_project`**: Client leaves a project room.
- **`task_created`**: Broadcasted when a new task is added.
- **`task_updated`**: Broadcasted when a task's status or details change.
- **`task_deleted`**: Broadcasted when a task is removed.

## Local Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with JWT_SECRET and MONGODB_URI
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access the App**: Navigate to `http://localhost:5173`

## Deployment Strategy
- **Backend**: Deployed on Render.com (Auto-deploy on push to GitHub).
- **Frontend**: Deployed on Netlify/Vercel (Auto-deploy on push to GitHub).
- **CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`) is configured to run installation and build checks on every push to the `main` branch.
- **SSL/HTTPS**: Handled automatically by the PaaS providers (Render/Netlify).

## Live URLs
- **Frontend URL**: `https://project-frontend-7vab.onrender.com`
- **Backend URL**: `https://internal-project-management.onrender.com`
