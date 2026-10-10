import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_S3_BUCKET } from "$env/static/private"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    forcePathStyle: true,
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    endpoint: AWS_ENDPOINT_URL_S3
});

export async function signUrl(key = "") {
    const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: AWS_S3_BUCKET, Key: key }), { expiresIn: 3600 });
    return url
}

export async function uploadFile(fileName = "", file: Buffer<ArrayBuffer>) {
    const response = await s3.send(new PutObjectCommand({ Bucket: AWS_S3_BUCKET, Key: fileName, Body: file }));
    return response
}
