# subway-sim

Interactive web application for designing and simulating subway systems. Users can create and manage stations and lines, define schedules, and simulate train movement and journey-based ticket pricing.

This project is a hands-on learning initiative, gradually building practical skills in full-stack web development, including frontend, backend, database integration, API design and system design.

# Learning roadmap
**Current progress**
1. HTML and CSS: basic UI creation
2. JavaScript: interactivity; creating, editing, moving UI elements; event listeners
3. MySQL: installation, local database setup, basic table structures
4. Python SQLAlchemy: connecting to the database; creating, editing, and querying tables
5. APIs: understanding how backend APIs work
6. Python FastAPI: setting up API endpoints for database operations

**Next Steps:**

7. JavaScript async patterns (async/await, promises) to communicate with backend API
8. More complex database relationships

# Design goals
- Incremental complexity to support learning
- Rapid prototyping of new concepts and features
- Clean separation of visual and domain logic
- Modular, extensible architecture
- Well-documented and maintainable code

# Feature Roadmap

**Interactive Subway Network Editor** ███████▒▒▒ 70% 
- Create stations on a canvas via mouse interaction
- Visual representation with labels and hover states
- Selection, focus, and editing of stations
- Drag-and-drop repositioning
- Contextual actions (hover details, delete via keyboard)

**Subway Network Connectivity** ▒▒▒▒▒▒▒▒▒▒ 0%
- Connect stations to form track segments
- Visual feedback for connections and selected paths
- Support for multi-line station membership

**Persistence & Data Model** ██▒▒▒▒▒▒▒▒ 20%
- Relational database schema for stations, lines, and connections
- Persist station metadata and coordinates
- Load and render saved networks from the database
- Sync UI interactions with backend state via API
    
**Line & Schedule Management** ▒▒▒▒▒▒▒▒▒▒ 0%
- Define subway lines as ordered station sequences
- Assign stations to multiple lines
- Basic timetable and frequency definitions

**Train Movement & Pricing Simulation** ▒▒▒▒▒▒▒▒▒▒ 0%
- Simulate train movement according to schedules
- Calculate journey paths and travel times
- Prototype distance- or zone-based ticket pricing (modeled on London Oyster card)
    



