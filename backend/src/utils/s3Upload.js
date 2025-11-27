import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      let folder = "images";
      if (file.mimetype.includes("pdf")) folder = "pdfs";
      const uniqueName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
      cb(null, `${folder}/${uniqueName}`);
    },
  }),
});

export const getFileUrl = (req, file) => file.location;

// 🗑️ Delete from S3
export const deleteFromS3 = async (url) => {
  try {
    const bucket = process.env.AWS_BUCKET_NAME;
    const key = url.split(".com/")[1]; // extract "folder/filename"
    
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    console.log(`🗑️ Deleted from S3: ${key}`);
  } catch (err) {
    console.error("Error deleting from S3:", err);
  }
};
