<h1 align="center">Unit 2 Fullstack Project – Axiomata</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Java-blue" />
  <img src="https://img.shields.io/badge/JavaScript-yellow" />
  <img src="https://img.shields.io/badge/SQL-orange" />
  <img src="https://img.shields.io/badge/React-blue" />
  <img src="https://img.shields.io/badge/Spring_Boot-brightgreen" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" />
</p>

A full-stack worldbuilding management tool for writers to create, manage, and explore fictional worlds.

**Axiomata** is a LaunchCode Unit 2 Capstone Project. It is a worldbuilding management tool designed to help writers organize the complex structures within their fictional worlds. The project features a hierarchical world system that allows users to create and manage locations, factions, characters, and items.

The backend includes procedural generation with cascading logic to construct expansive, interconnected world structures. Users can dynamically create, modify, and organize world elements through an intuitive interface. A structured content explorer displays nested world data and enables navigation between locations, factions, and characters.

## Table of Contents
- [Full Project Tech Stack](#full-project-tech-stack)
- [Repository Structure](#repository-structure)
- [Backend](#backend)
  - [Running Backend](#running-backend)
- [Frontend](#frontend)
  - [Running Frontend](#running-frontend)
- [Wireframes & Screenshots](#wireframes--screenshots)
- [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [Future Features / Unsolved Problems](#future-features--unsolved-problems)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## Full Project Tech Stack

- **Backend:** ![Java](https://img.icons8.com/color/16/java-coffee-cup-logo.png) Java, ![Spring](https://img.icons8.com/color/16/spring-logo.png) Spring Boot, ![MySQL](https://img.icons8.com/color/16/mysql-logo.png) MySQL, JPA/Hibernate  
- **Frontend:** ![JS](https://img.icons8.com/color/16/javascript.png) JavaScript, ![React](https://img.icons8.com/color/16/react-native.png) React (Vite), Axios  
- **Authentication:** JWT  
- **Styling & Tools:** ![CSS](https://img.icons8.com/color/16/css3.png) CSS

## Repository Structure

unit-2-fullstack-project-axiomata/
├─ README.md
├─ LICENSE
├─ .gitignore
├─ axiomata-backend/ # Spring Boot backend
└─ react-front-end-app/ # React frontend

## Backend

- Spring Boot 3.5.10
- Java 21
- MySQL database connection configured via environment variable `AXIOMATA_DB_PASSWORD`
- JPA/Hibernate

### Running Backend

Run the backend server from the backend folder:

```bash
./mvnw spring-boot:run
# or
mvn spring-boot:run
```

# Set your database password:

```bash
## Linux/macOS
export AXIOMATA_DB_PASSWORD=your_password

## Windows PowerShell
setx AXIOMATA_DB_PASSWORD "your_password"
```

## Frontend

- Fully functional React application  
- Node.js and npm required  

### Running Frontend

From the frontend folder, run:

```bash
npm install
npm run dev
```
The app runs at: http://localhost:5173

## Wireframes & Screenshots

- Digital wireframes: [View Presentation](https://docs.google.com/presentation/d/1VlIVu9gaA-GfLtI4HIXOQwvwizw8AF32IHh8fqylYe0/edit?slide=id.p#slide=id.p)

## Entity Relationship Diagram (ERD)

- ERD: [View Diagram](https://lucid.app/lucidchart/acaa6d33-fbc5-410a-80bf-ab464fe492ca/edit?viewport_loc=-148%2C-509%2C832%2C415%2C0_0&invitationId=inv_0fa9d507-16a7-4171-b752-eea29595f0c4)

### Click the links above to view the project's wireframes and entity relationship diagram.

## Future Features / Unsolved Problems

- Expanded world generation logic
- Character generator
- Map generation and visualization
- Editable resource pools and custom entity attributes
- JWT authentication and Context API for state management

## Getting Started

1. Clone the repository:

```bash
git clone <repo-url>
```

2. Set environment variable for the database password (see Backend section above).

3. Run backend and frontend as described above.

## Usage

1. Open your browser at http://localhost:5173
2. Log in or create a user account.
3. Navigate through the world explorer to view regions, factions, and characters.
4. Create or edit world elements using the “Add” buttons in each section.
5. Save changes to persist them in the database.

## License

This project is licensed under the [MIT License](LICENSE).