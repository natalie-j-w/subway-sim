# subway-sim

Interactive web application for designing subway networks in the browser.

This application allows users to place stations on a canvas, move and rename them, and connect stations to form a network. It focuses on interactive UI state management, event-driven logic, and visual representation of a domain model using vanilla JavaScript.


# Technical focus

- HTML and CSS for layout and basic styling
- Vanilla JavaScript for application logic
- Event-driven UI interactions
- Explicit separation between domain state and rendering logic
- Incremental feature development with an emphasis on clarity and maintainability
- Use of AI tools (Claude.ai, Gemini, ChatGPT, VSCode agents) as intentional learning aids. **No vibe coding!**

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



