# Task App

A simple browser-based task manager app with a full CI/CD pipeline built around it. The app allows users to add, delete, and toggle tasks as complete or incomplete, with a dropdown to filter by All, Active, and Done.

## Live Demo

[View the app on Render](https://task-app.onrender.com)

## Features

- Add tasks with a description
- Mark tasks as complete or incomplete
- Delete tasks
- Filter tasks by All, Active, and Done

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Web Server:** Nginx
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Registry:** Docker Hub
- **Deployment:** Render

## Project Structure

```
├── index.html
├── script.js
├── style.css
├── test.js
├── Dockerfile
├── .dockerignore
└── .github/
    └── workflows/
        └── ci.yml
```

## Run Locally

Make sure Docker Desktop is installed, then run:

```bash
docker pull sakhilen/task-app:latest
docker run -p 8080:80 sakhilen/task-app:latest
```

Open your browser and go to:

```
http://localhost:8080
```

## Run Tests

```bash
node test.js
```

Tests cover task creation, toggling completion, deleting by ID, and filter logic. They are compatible with both Node.js and the browser.

## CI/CD Pipeline

Every push to `feature-dev` or `dev` triggers the following automatically:

1. **Tests run** — if any test fails, the pipeline stops
2. **Docker image builds** — only if tests pass
3. **Image pushed to Docker Hub** — available at `sakhilen/task-app:latest`
4. **Render deploys** — pulls the latest image and serves the updated app

## Author

Sakhile — [GitHub](https://github.com/sakhileEcomplete)
