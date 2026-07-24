import multer from "multer";

/* -------------------------------------------------------------------------- */
/*                           Image Filter                                     */
/* -------------------------------------------------------------------------- */

export const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                             PDF Filter                                     */
/* -------------------------------------------------------------------------- */

export const pdfFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed."),
      false
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                           Presentation Filter                              */
/* -------------------------------------------------------------------------- */

export const presentationFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, PPT and PPTX files are allowed."
      ),
      false
    );
  }
};