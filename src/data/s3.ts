import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export async function getS3LogsObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  try {
    const response = (await s3Client.send(command)).Body;
    return JSON.parse((await response?.transformToString()) ?? "[]");
  } catch {
    return [];
  }
}
