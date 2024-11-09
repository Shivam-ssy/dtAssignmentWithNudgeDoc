import multer from 'multer';
import { cloudinary } from '../utilities/Cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', 
      format: async (req, file) => {
        const fileExtension = file.mimetype.split('/')[1];
        return fileExtension; 
      },
      public_id: (req, file) => file.originalname.split('.')[0] 
    }
  });
  
const upload = multer({ storage });

export default upload;
