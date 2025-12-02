import React, { useRef, useEffect, useState } from "react";
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
  rows = 3,
  columns = 4,
}) => {
  const cardRef = useRef(null);
  const gridRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateImageSize = () => {
      if (!gridRef.current) return;

      const gridElement = gridRef.current;
      const gridWidth = gridElement.clientWidth - paddingLeft - paddingRight;
      const gridHeight = gridElement.clientHeight - paddingTop - paddingBottom;

      // Calculate available space per cell
      const availableWidth = (gridWidth - (columnGap * (columns - 1))) / columns;
      const availableHeight = (gridHeight - (rowGap * (rows - 1))) / rows;

      // Apply the image scale
      const scaledWidth = availableWidth * (imageScale / 100);
      const scaledHeight = availableHeight * (imageScale / 100);

      setImageDimensions({
        width: Math.max(0, scaledWidth),
        height: Math.max(0, scaledHeight),
      });
    };

    calculateImageSize();

    // Recalculate on window resize
    window.addEventListener('resize', calculateImageSize);
    
    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(calculateImageSize, 100);

    return () => {
      window.removeEventListener('resize', calculateImageSize);
      clearTimeout(timeoutId);
    };
  }, [rows, columns, paddingTop, paddingRight, paddingBottom, paddingLeft, imageScale, rowGap, columnGap]);

  return (
    <div ref={cardRef} className="bingo-card-wrapper" id="bingo-card">
      <div
        className={`bingo-card ${!showBorders ? "no-borders" : ""}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        }}
      >
        <div
          ref={gridRef}
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
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
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
                    style={{
                      maxWidth: `${imageDimensions.width}px`,
                      maxHeight: `${imageDimensions.height}px`,
                      objectFit: 'contain',
                    }}
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
