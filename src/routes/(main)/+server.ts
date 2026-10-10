import { db } from '$lib/server/db';
import { image, type Image } from '$lib/server/db/schema';
import { and, desc, eq, lt } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { signUrl } from '$lib/server/s3';
import { json } from '@sveltejs/kit';

const limit = 9
export type ImageListResponse = {
    images: Image[],
    limit: number
}

export const GET: RequestHandler = async (event) => {
    if (!event.locals.user?.id) {
        return new Response();
    }

    const lastId = parseInt(event.url.searchParams.get("last_id") ?? "0")

    const images = await db.select()
        .from(image)
        .where(and(eq(image.user_id, event.locals.user?.id), lt(image.id, lastId))).limit(limit).orderBy(desc(image.createdAt))

    await Promise.all(images.map(async ax => {
        if (ax.image_key) {
            ax.image_key = await signUrl(ax.image_key)
        }
    }))

    return json({ images, limit })
};