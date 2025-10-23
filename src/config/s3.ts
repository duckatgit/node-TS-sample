import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import environment from "./environment";
dotenv.config();


const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } = environment;


if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET) {
  throw new Error('Missing required AWS S3 environment variables');
}


export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const BUCKET: string = S3_BUCKET;

export const S3_BASE: string = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com`;

export { PutObjectCommand };
