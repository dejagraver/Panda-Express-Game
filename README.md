# Interactive Drawing Application

## Overview

The Interactive Drawing Application is a browser-based creative tool built using JavaScript and p5.js. The application allows users to draw on a digital canvas using multiple drawing utilities while demonstrating modular software architecture, state management, and interactive UI development.

This project was designed to strengthen front-end programming skills, event handling, reusable code structures, and application state control.

## Features

### Drawing Tools
- Freehand drawing tool
- Spray paint tool
- Line drawing tool
- Eraser tool
- Mirror drawing tool
- Stamp tool

### User Functionality
- Undo/redo system
- State saving functionality
- Colour palette selection
- Dynamic tool switching
- Tooltip support
- Image API integration

### User Interface
- Responsive canvas interactions
- Organized toolbox system
- Interactive controls
- Custom styling with CSS

## Technologies Used

- JavaScript (ES6)
- p5.js
- HTML5
- CSS3


## Programming Concepts Demonstrated

### Modular Architecture
The application was structured using separate JavaScript modules for each tool and feature to improve readability, maintainability, and scalability.

Examples include:
- `freehandTool.js`
- `sprayCanTool.js`
- `eraserTool.js`
- `undoRedo.js`
- `stateSaving.js`

### State Management
- Undo and redo functionality
- Canvas state preservation
- Dynamic tool state tracking

### Software Engineering Practices
- Consistent naming conventions
- Reusable helper functions
- Separation of concerns
- Organized file structure
- Maintainable code patterns
- Event-driven programming

## How to Run the Project

1. Clone or download the repository
2. Open the project directory
3. Launch index.html in your browser

Recommended:
Use VS Code Live Server for development

## Challenges Faced

Some key challenges during development included:

* Managing drawing state efficiently
* Implementing reliable undo/redo functionality
* Designing reusable drawing tool architecture
* Handling mouse interaction events smoothly
* Structuring modular code for scalability

These challenges improved debugging, software organization, and front-end engineering skills.

## Future Improvements

Potential future enhancements include:

* Layer support
* Brush size customization
* Export/download drawings
* Touchscreen support
* Shape generation tools
* User accounts and cloud saving

## File Structure

```bash
project-folder/
│
├── index.html
├── sketch.js
├── style.css
├── toolbox.js
├── helperFunctions.js
├── freehandTool.js
├── sprayCanTool.js
├── eraserTool.js
├── lineToTool.js
├── mirrorDrawTool.js
├── stampTool.js
├── undoRedo.js
├── stateSaving.js
├── tooltip.js
└── colourPalette.js