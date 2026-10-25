import type { BookDoc } from '$lib/api/books';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { book, image, type BookInsert, type ImageInsert } from '$lib/server/db/schema';
import { uploadBase64 } from '$lib/server/s3';
import { OPENROUTER_KEY } from '$env/static/private';

export const POST: RequestHandler = async (event) => {
    const data: BookDoc[] = await event.request.json()

    if (!event.locals.user?.id) {
        return new Response()
    }

    const filename = `${Date.now()}.jpg`
    const imagePrompt = generateBasePrompt(data)

    const aiImageResponse = await generateImage(imagePrompt)
    const aiImageResponseDataURI = `data:${aiImageResponse.media_type};charset=utf-8;base64,${aiImageResponse.b64_json}`;

    const aiImageMetadataResponse = await generateImageMetadata(userstandImagePrompt(data), aiImageResponseDataURI)
    const aiImageMetadataResponseContent = extractJson(aiImageMetadataResponse ?? "")


    const imageWriteRow: ImageInsert = {
        user_id: event.locals.user?.id,
        image_key: filename,
        title: aiImageMetadataResponseContent?.title ?? "",
        description: aiImageMetadataResponseContent?.description ?? "",
        ai_prompt: aiImageMetadataResponseContent?.prompt ?? ""
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
    await uploadBase64(filename, Buffer.from(aiImageResponse.b64_json, "base64"), "image/jpeg")

    return new Response(JSON.stringify({ id: imageWriteResponse[0].id }), {
        headers: { 'Content-Type': 'application/json' }
    });
};


function generateBasePrompt(books: BookDoc[]) {
    const prompt = `Take the best parts from these books and create a crossover image.
    
    ${books.map(ax => `- ${ax.title}\n`).join("")}

    Rules
    - It should not be photorealistic.
    - Aspect Ratio 16:9.
    `
    return prompt
}

function userstandImagePrompt(books: BookDoc[]) {
    const prompt = `This image is based on these books metioned below, generate a title, description in json format with fields {title, description}
    
    ${books.map(ax => `- ${ax.title}\n`).join("")}
    `
    return prompt
}

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

type GenerateImageResponse = {
    created: number;
    data: {
        b64_json: string;
        media_type: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        cost: number;
        is_byok: boolean;
        prompt_tokens_details: {
            cached_tokens: number;
            cache_write_tokens: number;
            audio_tokens: number;
            video_tokens: number;
        };
        cost_details: {
            upstream_inference_cost: number;
            upstream_inference_prompt_cost: number;
            upstream_inference_completions_cost: number;
        };
        completion_tokens_details: {
            reasoning_tokens: number;
            image_tokens: number;
        };
    };
};

async function generateImage(prompt: string) {
    const response = await fetch("https://openrouter.ai/api/v1/images", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "google/gemini-3.1-flash-image",
            prompt: prompt,
        }),
    });

    const result = await response.json() as GenerateImageResponse;
    return result.data[0]
}

type GenerateImageMetadataResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    provider: string;
    system_fingerprint: string | null;
    service_tier: string;
    choices: {
        index: number;
        logprobs: null | any;
        finish_reason: string;
        native_finish_reason: string;
        message: {
            role: string;
            content: string;
            refusal: null | string;
            reasoning: string;
            reasoning_details?: {
                type: string;
                text: string;
                format: string;
                index: number;
            }[];
        };
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        cost: number;
        is_byok: boolean;
        prompt_tokens_details: {
            cached_tokens: number;
            cache_write_tokens: number;
            audio_tokens: number;
            video_tokens: number;
        };
        cost_details: {
            upstream_inference_cost: number;
            upstream_inference_prompt_cost: number;
            upstream_inference_completions_cost: number;
        };
        completion_tokens_details: {
            reasoning_tokens: number;
            image_tokens: number;
            audio_tokens: number;
        };
    };
};

async function generateImageMetadata(prompt: string, imgInBase64: string) {
    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/gemma-4-26b-a4b-it",
            "messages": [
                {
                    role: "user", content: [
                        { "type": "text", "text": prompt },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imgInBase64,
                            },
                        },

                    ]
                }
            ],
            "reasoning": { "enabled": false },
        })
    });

    const result = await response.json() as GenerateImageMetadataResponse;
    return result.choices[0].message.content
}