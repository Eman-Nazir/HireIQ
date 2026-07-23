import cloudinary from '../config/cloudinary.js';

export const uploadPDFToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', // PDFs are non-image files
        folder: 'hireiq/resumes',
        public_id: `${Date.now()}-${fileName.replace(/\.pdf$/i, '')}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};