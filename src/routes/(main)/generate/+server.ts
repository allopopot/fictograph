import type { BookDoc } from '$lib/api/books';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { book, image, type BookInsert, type ImageInsert } from '$lib/server/db/schema';
import { signUrl, uploadFile } from '$lib/server/s3';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
    const data: BookDoc[] = await event.request.json()
    const filename = `${Date.now()}.jpg`

    if (!event.locals.user?.id) {
        return new Response()
    }

    // Generate a Base Prompt ====================================================================================

    let basePrompt = `For these books listed below create a title, description and a prompt for a Text to image model to generate a fictional crossover image between these books.
${data.map(ax => `- ${ax.title}\n`).join("")}
Give it in a json output of fields containing title, description, prompt} without markdown code fences
It should not be photorealistic
It should be of aspect ratio 16:9
It should capture the essence of these books`

    let basePromptResponse = await event.platform?.env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
        messages: [
            { role: "system", content: "You are a visual artist" },
            {
                role: "user",
                content: basePrompt,
            },
        ],
        stream: false,
    })
    let basePromptResponseBody = basePromptResponse

    // Save Data to Database ====================================================================================

    const basePromptResponseBodyContent = extractJson(basePromptResponseBody?.choices[0]?.message?.content ?? "")
    const imageWriteRow: ImageInsert = {
        user_id: event.locals.user?.id,
        // image_key: filename,
        title: basePromptResponseBodyContent.title,
        description: basePromptResponseBodyContent.description
    }

    const imageWriteResponse = await db.insert(image).values(imageWriteRow).returning({ id: image.id })
    const sx: BookInsert[] = data.map(ax => {
        const a: BookInsert = {
            user_id: event.locals.user?.id ?? "",
            image_id: imageWriteResponse[0].id,
            image_url: `https://covers.openlibrary.org/b/ID/${ax.cover_i}-M.jpg`,
            key: ax.key,
            title: ax.title,
        }
        return a
    }).filter(ax => Boolean(ax))
    const bookWriteResponse = await db.insert(book).values([...sx])

    // Generate an Image out of the base prompt ====================================================================================

    let aiImage = await event.platform?.env.AI.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", {
        prompt: basePromptResponseBodyContent.prompt,
        width: 1920,
        height: 1080,
        num_steps: 20,
        guidance: 20,
    })
    const aiImageResponse = new Response(aiImage)

    // Upload the Image to S3 neon ====================================================================================

    await uploadFile(filename, Buffer.from(await aiImageResponse.arrayBuffer()))

    // Save image file to the database ====================================================================================

    await db.update(image).set({ image_key: filename }).where(eq(image.id, imageWriteResponse[0].id))

    // =======================================================================================================

    const url = await signUrl(filename);
    const formdata = new FormData()
    formdata.append("image", url)
    formdata.append("title", imageWriteRow.title ?? "")
    formdata.append("description", imageWriteRow.description ?? "")
    return new Response(formdata);
};


// async function fakeImageGenerator() {
//     const response = await fetch("https://picsum.photos/1920/1080")
//     const body = await response.arrayBuffer()
//     return body
// }

function extractJson(str: string) {
    const start = str.search(/[\[{]/);

    if (start === -1) {
        throw new Error("No JSON found");
    }

    for (let end = str.length - 1; end >= start; end--) {
        if (str[end] !== "}" && str[end] !== "]") continue;

        try {
            return JSON.parse(str.slice(start, end + 1));
        } catch {
            throw new Error("Malformed JSON");
        }
    }

    throw new Error("Invalid JSON found");
}


