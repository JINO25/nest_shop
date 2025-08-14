/* eslint-disable prettier/prettier */
export default () => ({
    cloudinary: {
        cloud_name: process.env.Cloudinary_NAME,
        api_key: process.env.Cloudinary_API,
        api_secret: process.env.Cloudinary_SECRET,
    },
});
