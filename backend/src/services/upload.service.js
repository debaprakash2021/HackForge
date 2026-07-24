import fs from "fs";

import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                           Upload to Cloudinary                             */
/* -------------------------------------------------------------------------- */

export const uploadFileService = async (
  filePath,
  folder = "HackForge"
) => {

  try {
    const result = await cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: "auto",
      }
    );

    fs.unlinkSync(filePath);

    return {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    };

  } catch (error) {

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new ApiError(
      500,
      "Failed to upload file to Cloudinary."
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                         Delete from Cloudinary                             */
/* -------------------------------------------------------------------------- */

export const deleteFileService = async (
  publicId
) => {

  const result =
    await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok") {
    throw new ApiError(
      404,
      "File not found on Cloudinary."
    );
  }

  return result;
};