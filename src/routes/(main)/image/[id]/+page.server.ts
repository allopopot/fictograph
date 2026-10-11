import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { image, book } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { signUrl } from '$lib/server/s3';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
    if (!event.locals.user?.id) {
        return error(401, 'Unauthorized');
    }

    const imageId = parseInt(event.params.id);
    if (isNaN(imageId)) {
        return error(400, 'Invalid image ID');
    }

    const images = await db
        .select()
        .from(image)
        .where(and(eq(image.id, imageId), eq(image.user_id, event.locals.user.id)))
        .innerJoin(book, eq(image.id, book.image_id));

    console.log(images)

    if (images.length === 0) {
        return error(404, 'Image not found');
    }

    const responseBody = {
        image: images[0].image,
        books: images.map(ax => ax.book)
    }

    if (responseBody.image.image_key) {
        responseBody.image.image_key = await signUrl(responseBody.image.image_key);
    }

    return responseBody;
}) satisfies PageServerLoad;

