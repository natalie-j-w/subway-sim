# subway-sim

Interactive web application for designing and simulating subway systems. Users can create and manage stations and lines, define schedules, and simulate train movement and journey-based ticket pricing.

This project is a hands-on learning initiative, gradually building practical skills in full-stack web development, including frontend, backend, database integration, API design and system design.

# Learning roadmap
**Current progress**
- HTML and CSS: basic UI creation
- JavaScript: interactivity; creating, editing, moving UI elements; event listeners

**Learned and to be used**

-  MySQL: installation, local database setup, basic table structures
-  Python SQLAlchemy: connecting to the database; creating, editing, and querying tables
-  APIS: understanding how backend APIs work
-  Python FastAPI: setting up API endpoints for database operations

**Next Steps:**

- JavaScript async patterns (async/await, promises) to communicate with backend API
- More complex database relationships

# Design goals
- Incremental complexity to support learning
- Rapid prototyping of new concepts and features
- Clean separation of visual and domain logic
- Well-documented, modular, maintainable code

# Feature Roadmap
Check out the connected [Project](https://github.com/users/natalie-j-w/projects/1) to see current project progress.

**Interactive Subway Network Editor** 
- Create stations on a canvas via mouse interaction
- Visual representation with labels and hover states
- Selection, focus, and editing of stations
- Drag-and-drop repositioning
- Contextual actions (hover details, delete via keyboard)

**Subway Network Connectivity** 
- Connect stations to form track segments
- Visual feedback for connections
- Define subway lines as ordered station sequences

**Train Movement & Pricing Simulation**
- Basic timetable and frequency definitions
- Simulate train movement according to schedules
- Calculate journey paths and travel times
- Prototype distance- or zone-based ticket pricing (modeled on London Oyster card)
    
**Persistence & Data Model** 
- Relational database schema for stations, lines, and connections
- Persist station metadata and coordinates
- Load and render saved networks from the database
- Sync UI interactions with backend state via API



