import React, { useState, useEffect } from 'react';
import BingoCard from './components/BingoCard';
import { generateBingoCard } from './utils/cardGenerator';
import { saveBingoCardAsPDF } from './utils/pdfExport';
import './App.css';

function App() {
  const [cardData, setCardData] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Generate initial card
  useEffect(() => {
    generateNewCard();
  }, []);

  const generateNewCard = () => {
    const newCard = generateBingoCard();
    setCardData(newCard);
    setMessage('');
  };

  const handleSavePDF = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const result = await saveBingoCardAsPDF();
      setMessage(result.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackgroundSelect = async () => {
    if (window.electron && window.electron.selectImage) {
      // Use Electron dialog
      const filePath = await window.electron.selectImage();
      if (filePath) {
        setBackgroundImage(`file://${filePath}`);
      }
    } else {
      // Fallback to file input for browser
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setBackgroundImage(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleClearBackground = () => {
    setBackgroundImage(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎲 Bingo Card Generator</h1>
      </header>

      <main className="app-main">
        <div className="controls">
          <button 
            onClick={generateNewCard}
            className="btn btn-primary"
          >
            🎰 Generate New Card
          </button>
          
          <button 
            onClick={handleBackgroundSelect}
            className="btn btn-secondary"
          >
            🖼️ Select Background
          </button>

          {backgroundImage && (
            <button 
              onClick={handleClearBackground}
              className="btn btn-secondary"
            >
              ❌ Clear Background
            </button>
          )}

          <button 
            onClick={handleSavePDF}
            disabled={isSaving || cardData.length === 0}
            className="btn btn-success"
          >
            {isSaving ? '💾 Saving...' : '💾 Save as PDF'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="card-preview">
          {cardData.length > 0 && (
            <BingoCard 
              cardData={cardData} 
              backgroundImage={backgroundImage}
            />
          )}
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Click <strong>Generate New Card</strong> to create a new random bingo card</li>
            <li>Click <strong>Select Background</strong> to add a custom background image</li>
            <li>Click <strong>Save as PDF</strong> to export the card as a PDF file</li>
            <li>Each column draws from a different set of images (color-coded)</li>
            <li>Each image appears only once per card</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
