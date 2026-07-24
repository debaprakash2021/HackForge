import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  uploadFileService,
  deleteFileService,
} from "../services/upload.service.js";

/* -------------------------------------------------------------------------- */
/*                            Upload File                                     */
/* -------------------------------------------------------------------------- */

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(
      new ApiResponse(400, "No file uploaded.")
    );
  }

  const folder =
    req.body.folder || "HackForge";

  const uploadedFile =
    await uploadFileService(
      req.file.path,
      folder
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      "File uploaded successfully.",
      uploadedFile
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Delete File                                      */
/* -------------------------------------------------------------------------- */

export const deleteFile = asyncHandler(async (req, res) => {
  await deleteFileService(
    req.params.publicId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "File deleted successfully."
    )
  );
});