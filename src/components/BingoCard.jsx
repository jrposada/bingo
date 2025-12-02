import React, { useRef } from "react";
import "./BingoCard.css";

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
  columnGap = 0,
}) => {
  const cardRef = useRef(null);

  return (
    <div ref={cardRef} className="bingo-card-wrapper" id="bingo-card">
      <div
        className={`bingo-card ${!showBorders ? "no-borders" : ""}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        }}
      >
        <div
          className="bingo-grid"
          style={{
            rowGap: `${rowGap}px`,
            columnGap: `${columnGap}px`,
            paddingTop: `${paddingTop}px`,
            paddingRight: `${paddingRight}px`,
            paddingBottom: `${paddingBottom}px`,
            paddingLeft: `${paddingLeft}px`,
            height: `calc(100% - (${paddingBottom}px))`,
            width: `calc(100% - (${paddingRight}px))`,
          }}
        >
          {cardData.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="bingo-cell"
              >
                {cell && (
                  <img
                    src={cell}
                    alt={`Cell ${rowIndex}-${colIndex}`}
                    className="cell-image"
                    style={{ transform: `scale(${imageScale / 100})` }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;
