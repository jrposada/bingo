const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let lastImageDirectory = null;
let lastPdfDirectory = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Register protocol for local file access
  protocol.registerFileProtocol('local-resource', (request, callback) => {
    const url = request.url.replace('local-resource://', '');
    
    let resourcePath;
    if (app.isPackaged) {
      // In production, extraResources are in the resources folder (parent of app.asar)
      resourcePath = path.join(process.resourcesPath, url);
    } else {
      // In development, files are in the public folder
      resourcePath = path.join(__dirname, '..', 'public', url);
    }
    
    callback({ path: resourcePath });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle save PDF request
ipcMain.handle('save-pdf', async (event, pdfBuffer) => {
  const options = {
    title: 'Save Bingo Card',
    defaultPath: `bingo-card-${Date.now()}.pdf`,
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  };

  // Set default path if we have a remembered directory
  if (lastPdfDirectory) {
    options.defaultPath = path.join(lastPdfDirectory, `bingo-card-${Date.now()}.pdf`);
  }

  const { filePath } = await dialog.showSaveDialog(options);

  if (filePath) {
    try {
      fs.writeFileSync(filePath, Buffer.from(pdfBuffer));
      // Remember the directory for next time
      lastPdfDirectory = path.dirname(filePath);
      return { success: true, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'No file path selected' };
});

// Handle select image file
ipcMain.handle('select-image', async () => {
  const options = {
    title: 'Select Background Image',
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
    ],
    properties: ['openFile']
  };

  // Set default path if we have a remembered directory
  if (lastImageDirectory) {
    options.defaultPath = lastImageDirectory;
  }

  const { filePaths } = await dialog.showOpenDialog(options);

  if (filePaths && filePaths.length > 0) {
    // Remember the directory for next time
    lastImageDirectory = path.dirname(filePaths[0]);
    
    try {
      // Read the file and convert to base64 data URL
      const imageBuffer = fs.readFileSync(filePaths[0]);
      const ext = path.extname(filePaths[0]).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      const mimeType = mimeTypes[ext] || 'image/jpeg';
      const base64 = imageBuffer.toString('base64');
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error reading image file:', error);
      return null;
    }
  }
  
  return null;
});
