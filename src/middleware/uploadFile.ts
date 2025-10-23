import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import logger from "../service/logger";
import { constants } from "../common/constants";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = constants.FILE_UPLOAD_PATH;

    logger.info("Saving file locally...");
    logger.info("Destination:", uploadPath);

    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;

    logger.info("Original filename:", file.originalname);
    logger.info("Generated filename:", uniqueName);
    logger.info("MIME type:", file.mimetype);
    logger.info("Size (approx):", file.size ?? "unknown");

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      logger.warn(`Blocked upload of file type: ${file.mimetype}`);
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  }
});

export default upload;
