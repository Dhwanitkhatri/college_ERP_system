import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (
  element,
  filename = "report.pdf",
  options = {}
) => {
  const {
    scale = 1.5,
    orientation = "portrait",
    fitToWidth = true,
    imageType = "image/jpeg",
    imageQuality = 0.8,
    singlePage = false, // force everything onto one page if true
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
    let pdfWidth, pdfHeight;
    if (orientation === "landscape") {
      pdfWidth = 297;
      pdfHeight = 210;
    } else {
      pdfWidth = 210;
      pdfHeight = 297;
    }

    const margin = 5;
    const usableWidth = pdfWidth - margin * 2;
    const usableHeight = pdfHeight - margin * 2;

    // Base scaling (fit to width by default)
    let finalWidth, finalHeight;
    if (fitToWidth) {
      finalWidth = usableWidth;
      finalHeight = (imgHeight * usableWidth) / imgWidth;
    } else {
      finalWidth = (imgWidth * usableWidth) / imgWidth;
      finalHeight = (imgHeight * usableWidth) / imgWidth;
    }

    // If we want a SINGLE page and it is too tall, shrink proportionally to fit height
    if (singlePage && finalHeight > usableHeight) {
      const shrinkFactor = usableHeight / finalHeight;
      finalWidth *= shrinkFactor;
      finalHeight *= shrinkFactor;
    }

    const pdf = new jsPDF(
      orientation === "landscape" ? "l" : "p",
      "mm",
      "a4"
    );

    // For singlePage: vertically center a bit; for multi-page: start near top
    const yStart = singlePage
      ? margin + Math.max(0, (usableHeight - finalHeight) / 2)
      : margin;

    pdf.addImage(
      imgData,
      imgFormat,
      margin,
      yStart,
      finalWidth,
      finalHeight,
      "",
      "FAST"
    );

    // Only add extra pages when NOT forcing singlePage
    if (!singlePage) {
      let heightLeft = finalHeight - pdfHeight;
      let position = yStart;

      while (heightLeft > 0) {
        position = heightLeft - finalHeight + yStart;
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
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};