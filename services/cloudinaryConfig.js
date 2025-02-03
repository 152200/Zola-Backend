import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dpzbnturc', 
    api_key: '373113341936965', 
    api_secret: '0yZjTJAIabgc2wTqI-eEXQMegOo' // Replace with your actual API secret
});

// Function to upload an image
// Function to upload an image
export const uploadImage = async (fileBuffer, options = {}) => {
    try {
        // Use Cloudinary's uploader.upload_stream to handle Buffer objects
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            // Pass the Buffer to the upload stream
            uploadStream.end(fileBuffer);
        });

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