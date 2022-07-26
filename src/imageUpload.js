import fs from "fs";

import cloudinary from "cloudinary";

// set your env variable CLOUDINARY_URL or set the following configuration

// File upload
export const uploadImageSingle = (image, options = {}) => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary.v2.uploader
    .upload(image, {
      ...options,
      resource_type: "image",
    })
    .then((result) => {
      // Image has been successfully uploaded on
      // cloudinary So we dont need local image
      // file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(image);
      return result;
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(image);
      return { message: "Fail" };
    });
};
