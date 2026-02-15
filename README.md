# Unit 2 Fullstack Project - Axiomata

This repository contains the backend and frontend for the Axiomata project.

## Structure

unit-2-fullstack-project-axiomata/
├─ README.md
├─ .gitignore
├─ axiomata-backend/ # Spring Boot backend
└─ react-front-end-app/ # React frontend

## Backend

- Spring Boot 3.5.10
- Java 21
- MySQL database connection configured via environment variable `AXIOMATA_DB_PASSWORD`
- Hikari connection pool, JPA/Hibernate

## Frontend

- React app (to be added)
- Node.js/npm required

## Getting Started

1. Clone the repo:
   ```bash
   git clone <repo-url>

2. Set environment variable for DB password:

    export AXIOMATA_DB_PASSWORD=your_password   # Linux/macOS
    setx AXIOMATA_DB_PASSWORD "your_password"   # Windows PowerShell