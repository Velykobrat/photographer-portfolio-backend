import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPublicIdFromUrl = (url: string): string | undefined => {
  const matches = url.match(/\/([^\/]+)$/);
  return matches ? matches[1] : undefined;
};

export default cloudinary;
