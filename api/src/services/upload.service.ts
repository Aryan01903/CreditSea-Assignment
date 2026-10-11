import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary";

export const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "loanpilot/salary-slips", resource_type: "auto" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
