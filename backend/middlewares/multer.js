import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");

export const profilePhotoUpload = multer({ storage }).single("profilePhoto");