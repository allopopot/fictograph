import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { image } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_S3_BUCKET } from '$env/static/private';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { error } from '@sveltejs/kit';

const s3 = new S3Client({
    forcePathStyle: true,
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    endpoint: AWS_ENDPOINT_URL_S3
});

export const GET: RequestHandler = async (event) => {
    if (!event.locals.user?.id) {
        return error(401, 'Unauthorized');
    }

    const imageId = parseInt(event.params.id);
    if (isNaN(imageId)) {
        return error(400, 'Invalid image ID');
    }

    const [row] = await db
        .select()
        .from(image)
        .where(and(eq(image.id, imageId), eq(image.user_id, event.locals.user.id)))
        .limit(1);

    if (!row || !row.image_key) {
        return error(404, 'Image not found');
    }

    const command = new GetObjectCommand({ Bucket: AWS_S3_BUCKET, Key: row.image_key });
    const s3Response = await s3.send(command);

    if (!s3Response.Body) {
        return error(500, 'Failed to retrieve image from storage');
    }

    const filename = `${row.title ?? 'image'}.png`;
    const contentType = s3Response.ContentType ?? 'image/png';

    // s3Response.Body is a ReadableStream in Node/Cloudflare Workers
    const stream = s3Response.Body.transformToWebStream();

    return new Response(stream, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            ...(s3Response.ContentLength
                ? { 'Content-Length': String(s3Response.ContentLength) }
                : {})
        }
    });
};

