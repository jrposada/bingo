// Generate image paths for local images
const generateImagePaths = (setNumber, imageCount = 9) => {
  const paths = [];
  for (let i = 1; i <= imageCount; i++) {
    paths.push(`/assets/images/set-${setNumber}/${i}.jpg`);
  }
  return paths;
};

// Image sets for each column using local images
export const defaultImageSets = {
  column1: generateImagePaths(1),
  column2: generateImagePaths(2),
  column3: generateImagePaths(3),
  column4: generateImagePaths(4)
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
 * Generates a new bingo card with the specified number of columns and rows
 * Each column uses images from its corresponding image set
 * Each image appears only once per card
 */
export function generateBingoCard(imageSets = defaultImageSets, rows = 3, cols = 4) {
  const card = [];
  
  // Create array of available columns from image sets
  const availableColumns = Object.values(imageSets);
  
  // Generate shuffled columns for the requested number of columns
  const shuffledColumns = [];
  for (let col = 0; col < cols; col++) {
    // Use modulo to cycle through available image sets if we need more columns
    const columnImages = availableColumns[col % availableColumns.length];
    shuffledColumns.push(shuffleArray(columnImages).slice(0, rows));
  }

  // Build the card row by row
  for (let row = 0; row < rows; row++) {
    const rowData = [];
    for (let col = 0; col < cols; col++) {
      rowData.push(shuffledColumns[col][row]);
    }
    card.push(rowData);
  }

  return card;
}
