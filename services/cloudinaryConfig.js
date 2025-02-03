import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dpzbnturc', 
    api_key: '373113341936965', 
    api_secret: '0yZjTJAIabgc2wTqI-eEXQMegOo' // Replace with your actual API secret
});

// Function to upload an image
export const uploadImage = async (imagePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// // Function to generate an optimized URL
// export const getOptimizedUrl = (publicId, options = {}) => {
//     return cloudinary.url(publicId, {
//         fetch_format: 'auto',
//         quality: 'auto',
//         ...options
//     });
// };

// // Function to apply transformations (e.g., auto-crop to square)
// export const getTransformedUrl = (publicId, options = {}) => {
//     return cloudinary.url(publicId, {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//         ...options
//     });
// };