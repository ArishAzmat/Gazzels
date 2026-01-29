# Learning Management System (LMS)

A full-stack LMS application for shop floor employee training management.

## 🚀 Quick Start

Start all services (backend, frontend, database) with one command:

```bash
docker-compose up -d --build
```

## 📱 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

## 🔐 Default Credentials

### Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123`

### Sample Employees
- **Email:** `employee1@example.com` to `employee10@example.com`
- **Password:** `password123`

## 🏗️ Project Structure

```
.
├── lms-backend/          # Django REST API
│   ├── apps/             # Django apps (authentication, courses, etc.)
│   ├── lms/              # Project settings
│   └── Dockerfile
├── lms-frontend/         # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React contexts
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml    # Docker orchestration
```

## 🛠️ Tech Stack

### Backend
- Django 5.0 + Django REST Framework
- PostgreSQL 15
- JWT Authentication (djangorestframework-simplejwt)
- Swagger/OpenAPI (drf-spectacular)

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- TanStack Query (React Query)
- Axios

## 🎯 Features

### Admin Features
- Employee Management (CRUD)
- Course Management with nested lessons
- Bulk Training Assignment
- Progress Tracking & Reports

### Employee Features
- View Assigned Trainings
- Course Player with lesson navigation
- Mark lessons as complete
- Track progress

## 🧪 Development

### Backend Development
```bash
cd lms-backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend Development
```bash
cd lms-frontend
npm install
npm run dev
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and update as needed:

```bash
# Backend
SECRET_KEY=your-secret-key
DB_NAME=lmsdb
DB_USER=lmsuser
DB_PASSWORD=lmspass123

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Seed database
docker-compose exec backend python manage.py seed_data
```

## 📚 API Documentation

Interactive API documentation is available at:
http://localhost:8000/api/schema/swagger-ui/

Test endpoints directly from the browser after logging in and obtaining a JWT token.
