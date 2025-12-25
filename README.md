# subway-sim

This project is an interactive web application for designing and simulating subway systems. Users can create and manage stations and lines, define schedules, and simulate train movement and journey-based ticket pricing.

The project is developed as a hands-on learning initiative with a strong focus on practical web development using good coding practices.

# Design goals
- Incremental complexity to support learning
- Rapid prototyping of new concepts and features
- Clean separation of visual and domain logic
- Modular, extensible architecture
- Appropriate documentation

# Feature Roadmap
## Phase 1 - Interactive subway network editor
- Create stations on a canvas via mouse interaction
- Visual representation of station data with labels and hover states
- Station selection, focus, and editing
- Drag-and-drop station repositioning
- Contextual actions (hover details, delete via keyboard)

### Skills needed
- Frontend architecture
- Event-driven programming (mouse, keyboard, focus states)
- UI/UX interaction design
- DOM performance and interaction modeling

## Phase 2 - Subway network connectivity (In Progress)
- Connect stations to form track segments
- Visual feedback for connections and selected paths
- Support for multi-line station membership

## Phase 3 - Persistence & data model (In Progress)
- Relational database schema for stations, lines, and connections
- Persist station metadata and spatial coordinates
- Load and render saved networks from the database
- Sync UI interactions with backend state

## Phase 4 - Line & schedule management (Planned)
- Define subway lines as ordered station sequences
- Assign stations to lines
- Basic timetable and frequency definitions

## Phase 5 - Train movement & pricing simulation (Planned)
- Simulate train movement according to schedule
- Calculate journey paths and travel times
- Prototype distance- or zone-based ticket pricing (initially based on London Oyster card)
