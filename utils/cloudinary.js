import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "db4yerdo5",
  api_key: "668556782765693",
  api_secret: "o25wI5q2seg00Xolb9gQChUT7PM",
});

const cloudinaryUploading = async (fileUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUpload,
      { folder: "users" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            {
              url: result.secure_url,
              asset_id: result.asset_id,
              public_id: result.public_id,
            },
            {
              resource_type: "auto",
            }
          );
        }
      }
    );
  });
};

const cloudinaryDeleting = async (fileUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileUpload, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(
          {
            uri: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      }
    });
  });
};

export { cloudinaryUploading, cloudinaryDeleting };
