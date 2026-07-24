import multer from "multer";
import path from "path";

import {
  imageFilter,
  pdfFilter,
  presentationFilter,
} from "../utils/fileFilter.js";

/* -------------------------------------------------------------------------- */
/*                              Disk Storage                                  */
/* -------------------------------------------------------------------------- */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

/* -------------------------------------------------------------------------- */
/*                            Upload Configurations                           */
/* -------------------------------------------------------------------------- */

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export const uploadPdf = multer({
  storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export const uploadPresentation = multer({
  storage,
  fileFilter: presentationFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});