import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (
  element,
  filename = "report.pdf",
  options = {}
) => {
  const {
    scale = 1.5,              // smaller than 3 → smaller PDF
    orientation = "portrait",
    fitToWidth = true,
    imageType = "image/jpeg",  // JPEG reduces size vs PNG
    imageQuality = 0.8,        // 0–1
  } = options;

  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const imgFormat = imageType === "image/png" ? "PNG" : "JPEG";
    const imgData = canvas.toDataURL(imageType, imageQuality);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // A4 size in mm
    let pdfWidth;
    let pdfHeight;
    if (orientation === "landscape") {
      pdfWidth = 297;
      pdfHeight = 210;
    } else {
      pdfWidth = 210;
      pdfHeight = 297;
    }

    const margin = 5;
    const usableWidth = pdfWidth - margin * 2;

    let finalWidth;
    let finalHeight;
    if (fitToWidth) {
      finalWidth = usableWidth;
      finalHeight = (imgHeight * usableWidth) / imgWidth;
    } else {
      finalWidth = (imgWidth * usableWidth) / imgWidth;
      finalHeight = (imgHeight * usableWidth) / imgWidth;
    }

    const pdf = new jsPDF(
      orientation === "landscape" ? "l" : "p",
      "mm",
      "a4"
    );

    let heightLeft = finalHeight;
    let position = margin;

    // First page
    pdf.addImage(
      imgData,
      imgFormat,
      margin,
      position,
      finalWidth,
      finalHeight,
      "",
      "FAST" // extra compression
    );
    heightLeft -= pdfHeight;

    // Additional pages if content is taller than one page
    while (heightLeft > 0) {
      position = heightLeft - finalHeight + margin;
      pdf.addPage();
      pdf.addImage(
        imgData,
        imgFormat,
        margin,
        position,
        finalWidth,
        finalHeight,
        "",
        "FAST"
      );
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};