import React, { useRef } from 'react';
import './BingoCard.css';

const BingoCard = ({ 
  cardData, 
  backgroundImage, 
  showBorders = true, 
  paddingTop = 0, 
  paddingRight = 0, 
  paddingBottom = 0, 
  paddingLeft = 0,
  imageScale = 100,
  rowGap = 0,
  columnGap = 0
}) => {
  const cardRef = useRef(null);

  return (
    <div 
      ref={cardRef}
      className="bingo-card-wrapper"
      id="bingo-card"
    >
      <div 
        className={`bingo-card ${!showBorders ? 'no-borders' : ''}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
        }}
      >
        <div 
          className="bingo-grid"
          style={{
            paddingTop: `${paddingTop}px`,
            paddingRight: `${paddingRight}px`,
            paddingBottom: `${paddingBottom}px`,
            paddingLeft: `${paddingLeft}px`,
            height: `calc(100% - ${paddingTop}px - ${paddingBottom}px)`,
            width: `calc(100% - ${paddingLeft}px - ${paddingRight}px)`,
            marginTop: `${paddingTop}px`,
            marginLeft: `${paddingLeft}px`,
            rowGap: `${rowGap}px`,
            columnGap: `${columnGap}px`
          }}
        >
          {cardData.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className="bingo-row"
              style={{
                gap: `${columnGap}px`
              }}
            >
              {row.map((cell, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className="bingo-cell"
                  style={{
                    background: 'transparent',
                    padding: `${(100 - imageScale) / 2}%`
                  }}
                >
                  {cell && (
                    <img 
                      src={cell} 
                      alt={`Cell ${rowIndex}-${colIndex}`}
                      className="cell-image"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;
