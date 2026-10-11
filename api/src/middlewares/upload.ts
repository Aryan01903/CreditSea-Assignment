import multer from "multer";
import { ApiError } from "../utils/apiError";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

export const uploadSalarySlip = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest("Only PDF, JPG and PNG files are allowed"));
  },
}).single("salarySlip");
