import { v2 as cloudinary } from 'cloudinary';
import { Logger } from '@nestjs/common';

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    const logger = new Logger('CloudinaryConfig');
    
    const config = cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinary.api.ping()
      .then(() => {
        logger.log(`✅ Cloudinary connected successfully to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
      })
      .catch((error) => {
        logger.error('❌ Failed to connect to Cloudinary:', error.message);
      });

    return config;
  },
};
