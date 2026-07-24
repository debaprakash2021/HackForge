import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  uploadImage,
  uploadPdf,
  uploadPresentation,
} from "../middlewares/multer.middleware.js";

import {
  uploadFile,
  deleteFile,
} from "../controllers/upload.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                             Upload Image                                   */
/* -------------------------------------------------------------------------- */

router.post(
  "/image",
  authMiddleware,
  uploadImage.single("file"),
  uploadFile
);

/* -------------------------------------------------------------------------- */
/*                              Upload PDF                                    */
/* -------------------------------------------------------------------------- */

router.post(
  "/pdf",
  authMiddleware,
  uploadPdf.single("file"),
  uploadFile
);

/* -------------------------------------------------------------------------- */
/*                        Upload PPT / PPTX                                   */
/* -------------------------------------------------------------------------- */

router.post(
  "/presentation",
  authMiddleware,
  uploadPresentation.single("file"),
  uploadFile
);

/* -------------------------------------------------------------------------- */
/*                             Delete File                                    */
/* -------------------------------------------------------------------------- */

router.delete(
  "/:publicId",
  authMiddleware,
  deleteFile
);

export default router;