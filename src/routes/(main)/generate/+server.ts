import type { BookDoc } from '$lib/api/books';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { book, image, type BookInsert, type ImageInsert } from '$lib/server/db/schema';
import { signUrl, uploadFile } from '$lib/server/s3';

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

    const imageWriteRow: ImageInsert = {
        user_id: event.locals.user?.id,
        image_key: filename,
        title: data.map(ax => ax.title).join(' × '),
        description: `A mashup inspired by ${data.map(ax => `"${ax.title}" by ${ax.author_name?.join(', ') ?? 'Unknown'}`).join(' and ')}. Generated on ${new Date().toLocaleDateString()}.`
    }

    const imageWriteRes = await db.insert(image).values(imageWriteRow).returning({
        id: image.id
    })

    const sx: BookInsert[] = data.map(ax => {
        const a: BookInsert = {
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
    await uploadFile(filename, Buffer.from(file))

    const url = await signUrl(filename);
    const formdata = new FormData()
    formdata.append("image", url)
    formdata.append("title", imageWriteRow.title ?? "")
    formdata.append("description", imageWriteRow.description ?? "")
    return new Response(formdata);
};


async function fakeImageGenerator() {
    const response = await fetch("https://picsum.photos/1920/1080")
    const body = await response.arrayBuffer()
    return body
}


