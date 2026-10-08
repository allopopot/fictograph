import type { BookDoc } from '$lib/api/books';
import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3 } from "$env/static/private"
import { db } from '$lib/server/db';
import { book, image, type Book } from '$lib/server/db/schema';

const s3 = new S3Client({
    forcePathStyle: true,
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    endpoint: AWS_ENDPOINT_URL_S3
});
const bucket = "fictograph";

export const POST: RequestHandler = async (event) => {
    const data: BookDoc[] = await event.request.json()
    if (!event.locals.user?.id) {
        return new Response()
    }

    // const response = await event.platform?.env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
    //     requests: [
    //         {
    //             prompt: 'a cyberpunk lizard',
    //             seed: Math.floor(Math.random() * 10)
    //         }
    //     ]
    // })
    // console.log(response, "================")
    // const binaryString = atob(response);

    const filename = `${Date.now()}.jpg`

    const imageWriteRes = await db.insert(image).values({
        user_id: event.locals.user?.id,
        image_key: filename
    }).returning({
        id: image.id
    })

    const sx: Book[] = data.map(ax => {
        const a: Book = {
            user_id: event.locals.user?.id ?? "",
            image_id: imageWriteRes[0].id,
            image_url: `https://covers.openlibrary.org/b/ID/${ax.cover_i}-M.jpg`,
            key: ax.key,
            title: ax.title,
        }
        return a
    }).filter(ax => Boolean(ax))

    const bookWriteRes = await db.insert(book).values([...sx])

    const file = await fakeImageGenerator()
    const re = await s3.send(new PutObjectCommand({ Bucket: bucket, Key: filename, Body: Buffer.from(file) }));
    const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: filename }), { expiresIn: 3600 });
    const formdata = new FormData()
    formdata.append("image", url)
    return new Response(formdata);
};


async function fakeImageGenerator() {
    const response = await fetch("https://dummyfiles.dev/image/1920x1080")
    const body = await response.arrayBuffer()
    return body
}


