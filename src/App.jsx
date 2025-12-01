import React, { useState, useEffect } from 'react';
import { Button, Slider, Checkbox } from 'antd';
import BingoCard from './components/BingoCard';
import PaddingControl from './components/PaddingControl';
import { generateBingoCard } from './utils/cardGenerator';
import { saveBingoCardAsPDF } from './utils/pdfExport';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  const [cardData, setCardData] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showBorders, setShowBorders] = useState(true);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [imageScale, setImageScale] = useState(100);
  const [rowGap, setRowGap] = useState(0);
  const [columnGap, setColumnGap] = useState(0);
  const [showPaddingControl, setShowPaddingControl] = useState(false);
  
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
      // Use Electron dialog (returns base64 data URL)
      const dataUrl = await window.electron.selectImage();
      if (dataUrl) {
        setBackgroundImage(dataUrl);
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
          <Button 
            onClick={generateNewCard}
            type="primary"
            size="large"
          >
            🎰 Generate New Card
          </Button>
          
          <Button 
            onClick={handleBackgroundSelect}
            size="large"
          >
            🖼️ Select Background
          </Button>

          {backgroundImage && (
            <Button 
              onClick={handleClearBackground}
              size="large"
            >
              ❌ Clear Background
            </Button>
          )}

          <Button 
            onClick={handleSavePDF}
            disabled={isSaving || cardData.length === 0}
            type="primary"
            size="large"
            style={{ background: '#4facfe' }}
          >
            {isSaving ? '💾 Saving...' : '💾 Save as PDF'}
          </Button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="content-container">
          <div className="card-preview" style={{ position: 'relative' }}>
            {cardData.length > 0 && (
              <>
                <BingoCard 
                  cardData={cardData} 
                  backgroundImage={backgroundImage}
                  showBorders={showBorders}
                  paddingTop={paddingTop}
                  paddingRight={paddingRight}
                  paddingBottom={paddingBottom}
                  paddingLeft={paddingLeft}
                  imageScale={imageScale}
                  rowGap={rowGap}
                  columnGap={columnGap}
                />
                <PaddingControl
                  paddingTop={paddingTop}
                  paddingRight={paddingRight}
                  paddingBottom={paddingBottom}
                  paddingLeft={paddingLeft}
                  onPaddingChange={(edge, value) => {
                    switch(edge) {
                      case 'top': setPaddingTop(value); break;
                      case 'right': setPaddingRight(value); break;
                      case 'bottom': setPaddingBottom(value); break;
                      case 'left': setPaddingLeft(value); break;
                    }
                  }}
                  isVisible={showPaddingControl}
                />
              </>
            )}
          </div>

          <div className="settings">
            <h3>Settings:</h3>
            <div className="setting-group">
              <Checkbox
                checked={showBorders}
                onChange={(e) => setShowBorders(e.target.checked)}
              >
                Show Grid Borders
              </Checkbox>
            </div>
            <div className="setting-group">
              <label>Image Scale: {imageScale}%</label>
              <Slider
                min={30}
                max={100}
                step={5}
                value={imageScale}
                onChange={setImageScale}
                tooltip={{ open: false }}
              />
            </div>
            <div className="setting-group">
              <label>Row Gap: {rowGap}px</label>
              <Slider
                min={0}
                max={30}
                step={1}
                value={rowGap}
                onChange={setRowGap}
                tooltip={{ open: false }}
              />
            </div>
            <div className="setting-group">
              <label>Column Gap: {columnGap}px</label>
              <Slider
                min={0}
                max={30}
                step={1}
                value={columnGap}
                onChange={setColumnGap}
                tooltip={{ open: false }}
              />
            </div>
            <div className="setting-group">
              <Checkbox
                checked={showPaddingControl}
                onChange={(e) => setShowPaddingControl(e.target.checked)}
              >
                Show Padding Controls
              </Checkbox>
            </div>
          </div>
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
