# Orbit Verse

AI-powered DevOps companion built with Django, Tailwind, and Gemini.

## Setup

1.  **Environment Variables**:
    Copy `.env` and fill in your API keys and database credentials.
    ```bash
    # .env
    VITE_GEMINI_API_KEY=your_key_here
    DATABASE_URL=postgresql://postgres:postgres@db:5432/orbitverse
    REDIS_URL=redis://redis:6379/0
    ```

2.  **Docker**:
    Run the application using Docker Compose.
    ```bash
    docker-compose up --build
    ```

3.  **Access**:
    -   Web: http://localhost:8000
    -   Admin: http://localhost:8000/admin/

## Features Implemented (Phase 1-3)

-   **Full Auto Mode**: Generate projects from prompts.
-   **AI Integration**: Gemini 2.5 Flash integration for analysis and code generation.
-   **UI/UX**: Dark theme, Glassmorphism, Tailwind CSS.
-   **Backend**: Django 5.x, DRF, Celery, Redis, PostgreSQL.

## Next Steps

-   Implement Semi-Auto Mode (Checkpoints).
-   Implement Manual Builder (Drag-and-Drop).
-   GitHub Integration.
