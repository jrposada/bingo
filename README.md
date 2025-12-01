# Bingo Card Generator

An Electron + React application for generating custom Bingo cards with images.

## Features

- **4x3 Grid Layout**: Each card has 4 columns and 3 rows
- **Image-based Cells**: Use images instead of numbers
- **Column-specific Image Sets**: Each column draws from a different set of images
- **Unique Images**: Each image appears only once per card
- **Custom Backgrounds**: Add custom background images that align with the grid
- **PDF Export**: Save generated cards as PDF files
- **Random Generation**: Generate new random cards on demand

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Run the app in development mode:
```bash
npm run electron:dev
```

This will:
- Start the Vite development server
- Launch the Electron window
- Enable hot reloading for React components

## Building

Build the application for production:
```bash
npm run electron:build
```

## Customizing Image Sets

The application uses placeholder images by default. To use your own images:

1. Open `src/utils/cardGenerator.js`
2. Replace the URLs in `defaultImageSets` with your own image URLs or paths
3. Each column should have at least 3 images (one for each row)
4. You can add more images to increase variety

Example:
```javascript
export const defaultImageSets = {
  column1: [
    '/path/to/image1.png',
    '/path/to/image2.png',
    '/path/to/image3.png',
    // Add more images...
  ],
  // ... other columns
};
```

## Usage

1. **Generate New Card**: Click the "Generate New Card" button to create a random bingo card
2. **Select Background**: Click "Select Background" to choose a custom background image
3. **Clear Background**: Remove the background by clicking "Clear Background"
4. **Save as PDF**: Export the current card as a PDF file

## Project Structure

```
bingo/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script for IPC
├── src/
│   ├── components/
│   │   ├── BingoCard.jsx      # Bingo card component
│   │   └── BingoCard.css      # Card styles
│   ├── utils/
│   │   ├── cardGenerator.js   # Card generation logic
│   │   └── pdfExport.js       # PDF export functionality
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Technologies Used

- **Electron**: Desktop application framework
- **React**: UI library
- **Vite**: Build tool and dev server
- **html2canvas**: Convert HTML to canvas for PDF export
- **jsPDF**: Generate PDF files

## License

MIT
