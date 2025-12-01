const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  savePDF: (pdfBuffer) => ipcRenderer.invoke('save-pdf', pdfBuffer),
  selectImage: () => ipcRenderer.invoke('select-image')
});
