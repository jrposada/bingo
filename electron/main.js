const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

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

app.whenReady().then(createWindow);

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
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Bingo Card',
    defaultPath: `bingo-card-${Date.now()}.pdf`,
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, Buffer.from(pdfBuffer));
      return { success: true, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: false, error: 'No file path selected' };
});

// Handle select image file
ipcMain.handle('select-image', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Background Image',
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
    ],
    properties: ['openFile']
  });

  if (filePaths && filePaths.length > 0) {
    return filePaths[0];
  }
  
  return null;
});
