import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Node.js file system for temporary files

const uploadOnCloudinary = async (localFilePath) => {
    // 1. Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!localFilePath) return null;

        // 2. Upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detects image, video, etc.
        });

        // File upload success hone ke baad local temporary file delete karein
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Agar upload fail ho jaye, tab bhi server se temp file delete karein
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};

export { uploadOnCloudinary };