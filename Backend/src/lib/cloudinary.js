import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

cloudinary.config({
    cloud_name: "dpq0wpobg",
    api_key: "645277767823688",
    api_secret: "C0LTP7oIt3bulWpGmtSwMxabHYU"
});

console.log("Cloudinary config:", cloudinary.config());

export default cloudinary;

