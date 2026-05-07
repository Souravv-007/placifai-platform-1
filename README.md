# placifai-platform

PlacifAI is an AI-assisted career coaching platform built as a React frontend and an Express/PostgreSQL backend. The product focuses on helping users improve their resume, generate role-based career roadmaps, practice mock interviews, review company-specific prep material, and track readiness over time.

## What it does

- User registration and login with JWT-based authentication
- Resume upload and parsing for PDF, TXT, DOC, and DOCX files
- Resume analysis powered by OpenRouter, with local fallback payloads when AI credentials are not configured
- Personalized career roadmap generation based on target role, experience, and latest resume context
- Mock interview sessions with follow-up questions, feedback, and scoring
- Company prep summaries and role-specific interview insights
- Dashboard, analytics, and progress views for tracking readiness

## Tech stack

### Frontend

- React 18
- Vite 5
- React Router
- Zustand
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express 5
- PostgreSQL
- Sequelize
- JWT authentication
- Multer for file uploads
- `pdf-parse` and `mammoth` for resume text extraction
- OpenRouter for LLM-backed features

## Project structure

```text
placifai-platform/
|-- frontend/   # React + Vite client
|-- backend/    # Express API + Sequelize models
|-- public/
|-- logs/
`-- README.md
```

## Main routes

### Frontend pages

- `/` landing page
- `/login` and `/register`
- `/dashboard`
- `/roadmap`
- `/analytics`
- `/company-prep`
- `/interview`
- `/progress`
- `/prep`

### Backend API

- `/api/auth` register, login, logout, current user
- `/api/resume` upload, analyze, list, fetch, delete resumes
- `/api/roadmap` generate and update roadmaps
- `/api/interview` start interview sessions, submit answers, view history
- `/api/company-prep` browse company prep content and role-specific insights
- `/api/dashboard` fetch dashboard summary
- `/api/analytics` fetch summary, skill gaps, progress, and readiness
- `/api/progress` fetch combined progress summary

## Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL

## Local setup

### 1. Install dependencies

Open two terminals.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Configure backend environment variables

Create `backend/.env` with values like:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=placifai
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRE=7d

OPEN_ROUTER_API_KEY=your_openrouter_key
OPEN_ROUTER_REFERER=http://localhost:5173

UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5242880
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

The API starts on `http://localhost:5000`.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The Vite dev server usually starts on `http://localhost:5173`.

## Available scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Important implementation notes

- The frontend API base URL is currently hardcoded to `http://localhost:5000/api` in `frontend/src/services/api.js`.
- The backend runs `sequelize.sync({ alter: true })` on startup. That is convenient for development, but it should be reviewed before production use.
- Resume uploads default to a 5 MB max file size.
- Uploaded files are stored under `backend/public/uploads` when the backend is started from the `backend` directory.
- If `OPEN_ROUTER_API_KEY` is missing, several AI flows fall back to local generated payloads so the app can still run in development.

## Data flow overview

1. A user signs up or logs in and receives a JWT.
2. The frontend stores the token and sends it as a Bearer token on API calls.
3. Resume uploads are parsed on the backend and stored in PostgreSQL with extracted text.
4. AI-backed endpoints use the latest resume and user context to generate analysis, roadmaps, interview feedback, and company insights.
5. Dashboard and analytics endpoints aggregate stored resume, roadmap, and interview session data into user-facing summaries.

## Current limitations

- There is no automated test suite configured yet.
- Frontend runtime configuration is not environment-driven yet.
- The backend is development-oriented and needs production hardening around deployment, secrets management, and schema migration strategy.

## Contributing

Contributions are always welcome! Please feel free to open an issue or submit a pull request if you'd like to help improve PlacifAI.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).