import React, { useRef } from 'react';
import './BingoCard.css';

const BingoCard = ({ cardData, backgroundImage }) => {
  const cardRef = useRef(null);

  return (
    <div 
      ref={cardRef}
      className="bingo-card-wrapper"
      id="bingo-card"
    >
      <div 
        className="bingo-card"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
        }}
      >
        {cardData.map((row, rowIndex) => (
          <div key={rowIndex} className="bingo-row">
            {row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="bingo-cell">
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
  );
};

export default BingoCard;
