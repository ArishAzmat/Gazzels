# Development Environment with Hot Reloading

This guide explains how to use the development Docker setup with hot reloading enabled.

## Quick Start

### Start Development Environment
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Stop Development Environment
```bash
docker compose -f docker-compose.dev.yml down
```

### Rebuild Without Cache
```bash
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

## What's Different in Dev Mode?

### Frontend (Vite Dev Server)
- **Hot Module Replacement (HMR)**: Changes to React components, CSS, and other files are instantly reflected in the browser
- **Port**: Runs on `http://localhost:5173`
- **Volume Mounted**: Your local `lms-frontend` folder is mounted, so all code changes are immediately available
- **node_modules**: Uses a Docker volume to prevent conflicts between host and container dependencies

### Backend (Django Development Server)
- **Auto-reload**: Changes to Python files automatically restart the Django server
- **Port**: Runs on `http://localhost:8000`
- **Volume Mounted**: Your local `lms-backend` folder is mounted for live code updates
- **DEBUG Mode**: Runs with `DEBUG=True` for detailed error messages

### Database
- **Separate Volume**: Uses `postgres_data_dev` to keep development data separate from production
- **Port**: Accessible on `localhost:5432`

## Development Workflow

1. **Start the containers**:
   ```bash
   docker compose -f docker-compose.dev.yml up
   ```

2. **Make code changes**: Edit files in `lms-frontend` or `lms-backend` directories

3. **See changes instantly**: 
   - Frontend: Changes appear immediately in browser
   - Backend: Server auto-restarts (watch terminal for restart messages)

4. **View logs**:
   ```bash
   # All services
   docker compose -f docker-compose.dev.yml logs -f
   
   # Specific service
   docker compose -f docker-compose.dev.yml logs -f frontend
   docker compose -f docker-compose.dev.yml logs -f backend
   ```

## Running Database Migrations

```bash
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

## Creating a Superuser

```bash
docker compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

## Installing New Dependencies

### Frontend (npm packages)
```bash
docker compose -f docker-compose.dev.yml exec frontend npm install <package-name>
```

### Backend (Python packages)
```bash
docker compose -f docker-compose.dev.yml exec backend pip install <package-name>
# Don't forget to update requirements.txt
docker compose -f docker-compose.dev.yml exec backend pip freeze > requirements.txt
```

## Production vs Development

| Aspect | Production (`docker-compose.yml`) | Development (`docker-compose.dev.yml`) |
|--------|-----------------------------------|----------------------------------------|
| Frontend Server | Nginx (static) | Vite Dev Server |
| Backend Server | Gunicorn | Django runserver |
| Hot Reload | ❌ No | ✅ Yes |
| Debug Mode | ❌ False | ✅ True |
| Volume Mounting | Backend only | Both services |
| Build Time | Slower (with optimizations) | Faster |

## Troubleshooting

### Hot Reload Not Working (Frontend)
1. Check if the container is running: `docker ps`
2. Verify volumes are mounted: `docker compose -f docker-compose.dev.yml config`
3. Restart the container: `docker compose -f docker-compose.dev.yml restart frontend`

### Backend Not Auto-Reloading
1. Check logs: `docker compose -f docker-compose.dev.yml logs backend`
2. Ensure volume is mounted correctly
3. Restart the backend: `docker compose -f docker-compose.dev.yml restart backend`

### Port Conflicts
If ports 5173, 8000, or 5432 are already in use:
1. Stop the conflicting service
2. Or modify ports in `docker-compose.dev.yml`

### Permission Issues (Linux/Mac)
If you encounter permission errors:
```bash
sudo chown -R $USER:$USER lms-frontend lms-backend
```

## Tips

- **Keep containers running**: Leave them running while developing for instant feedback
- **Use `.dockerignore`**: Ensure unnecessary files aren't copied during builds
- **Monitor resource usage**: Docker Desktop shows CPU/memory usage per container
- **Database persistence**: Dev database persists in `postgres_data_dev` volume
