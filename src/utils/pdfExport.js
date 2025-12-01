import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Converts the bingo card element to PDF and saves it
 */
export async function saveBingoCardAsPDF() {
  const cardElement = document.getElementById('bingo-card');
  
  if (!cardElement) {
    throw new Error('Bingo card element not found');
  }

  try {
    // Capture the card as a canvas
    const canvas = await html2canvas(cardElement, {
      scale: 2, // Higher quality
      useCORS: true, // Allow cross-origin images
      backgroundColor: '#ffffff'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit the card on the page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Use full page dimensions with small margins
    const margin = 10; // 10mm margin on each side
    const width = pdfWidth - (2 * margin);
    const height = pdfHeight - (2 * margin);
    const x = margin;
    const y = margin;

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
      pdf.save(`bingo-card-${Date.now()}.pdf`);
      return { success: true, message: 'PDF downloaded' };
    }
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
}
