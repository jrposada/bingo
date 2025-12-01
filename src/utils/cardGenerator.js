// Sample image sets for each column
// In a real application, these would be actual image URLs or paths
export const defaultImageSets = {
  column1: [
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A1',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A2',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A3',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A4',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A5',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A6',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A7',
    'https://dummyimage.com/100x100/FF6B6B/FFFFFF&text=A8',
  ],
  column2: [
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B1',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B2',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B3',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B4',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B5',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B6',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B7',
    'https://dummyimage.com/100x100/4ECDC4/FFFFFF&text=B8',
  ],
  column3: [
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C1',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C2',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C3',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C4',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C5',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C6',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C7',
    'https://dummyimage.com/100x100/45B7D1/FFFFFF&text=C8',
  ],
  column4: [
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D1',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D2',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D3',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D4',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D5',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D6',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D7',
    'https://dummyimage.com/100x100/96CEB4/FFFFFF&text=D8',
  ]
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generates a new bingo card with 4 columns and 3 rows
 * Each column uses images from its corresponding image set
 * Each image appears only once per card
 */
export function generateBingoCard(imageSets = defaultImageSets) {
  const card = [];
  const ROWS = 3;
  const COLS = 4;

  // Shuffle each column's image set and take the first ROWS images
  const shuffledColumns = [
    shuffleArray(imageSets.column1).slice(0, ROWS),
    shuffleArray(imageSets.column2).slice(0, ROWS),
    shuffleArray(imageSets.column3).slice(0, ROWS),
    shuffleArray(imageSets.column4).slice(0, ROWS)
  ];

  // Build the card row by row
  for (let row = 0; row < ROWS; row++) {
    const rowData = [];
    for (let col = 0; col < COLS; col++) {
      rowData.push(shuffledColumns[col][row]);
    }
    card.push(rowData);
  }

  return card;
}
