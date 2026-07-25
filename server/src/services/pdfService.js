import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const result = await pdfParse(fileBuffer);
    return result.text.trim();
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
};