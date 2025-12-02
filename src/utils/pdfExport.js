import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Converts the bingo cards container element to PDF and saves it
 */
export async function saveBingoCardAsPDF() {
  const cardsContainer = document.getElementById('bingo-cards-container');
  
  if (!cardsContainer) {
    throw new Error('Bingo cards container element not found');
  }

  try {
    // Capture all cards as a canvas
    const canvas = await html2canvas(cardsContainer, {
      scale: 2, // Higher quality
      useCORS: true, // Allow cross-origin images
      backgroundColor: '#ffffff'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');

    // Create PDF in landscape orientation
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit all 9 cards on the page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate aspect ratio to fit properly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;
    
    let width, height, x, y;
    
    if (canvasAspectRatio > pdfAspectRatio) {
      // Canvas is wider, fit to width
      width = pdfWidth;
      height = pdfWidth / canvasAspectRatio;
      x = 0;
      y = (pdfHeight - height) / 2;
    } else {
      // Canvas is taller, fit to height
      height = pdfHeight;
      width = pdfHeight * canvasAspectRatio;
      x = (pdfWidth - width) / 2;
      y = 0;
    }

    pdf.addImage(imgData, 'PNG', x, y, width, height);

    // Check if running in Electron
    if (window.electron && window.electron.savePDF) {
      // Use Electron's save dialog
      const pdfBuffer = pdf.output('arraybuffer');
      const result = await window.electron.savePDF(pdfBuffer);
      
      if (result.success) {
        return { success: true, message: `PDF saved to ${result.path}` };
      } else {
        throw new Error(result.error);
      }
    } else {
      // Fallback to browser download
      pdf.save(`bingo-cards-${Date.now()}.pdf`);
      return { success: true, message: 'PDF downloaded' };
    }
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
}
