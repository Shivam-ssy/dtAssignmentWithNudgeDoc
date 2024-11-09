import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({
    path:'/.env'
})
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileNameWithExtension = parts.pop(); 
  const publicId = fileNameWithExtension.split('.')[0]; 
  
  const publicIdWithPath = parts.slice(parts.indexOf('upload') + 1).join('/') + '/' + publicId;
  return publicIdWithPath.replace('//', '/');
};

const deleteFileByUrl = async (url) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    console.log('Deleting file with public_id:', publicId);

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); 
    console.log('File deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export {cloudinary,deleteFileByUrl}