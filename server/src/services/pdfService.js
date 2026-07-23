import { PDFParse } from 'pdf-parse';

export const extractTextFromPDF = async (fileBuffer) => {
  const parser = new PDFParse({ data: fileBuffer });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  } finally {
    await parser.destroy(); // releases resources — required by v2's API
  }
};