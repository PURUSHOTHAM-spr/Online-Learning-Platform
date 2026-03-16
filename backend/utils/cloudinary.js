import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from 'dotenv';

config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Auto detects video, image, etc.
        });
        
        // Remove the locally saved temporary file after upload is successful
        fs.unlinkSync(localFilePath); 
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};
