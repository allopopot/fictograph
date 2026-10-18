import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { image, book } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteFile, signUrl } from '$lib/server/s3';
import { error, redirect } from '@sveltejs/kit';

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

export const actions: Actions = {
    delete: async (event) => {
        if (!event.locals.user?.id) {
            return error(401, 'Unauthorized');
        }

        const { id } = event.params

        let imageRes = await db.query.image.findFirst({
            where(fields, operators) {
                return operators.and(
                    operators.eq(fields.id, parseInt(id)),
                    operators.eq(fields.user_id, event.locals.user?.id ?? "")
                )
            },
        })
        if (!imageRes) {
            return redirect(302, "/")
        }
        try {
            await deleteFile(imageRes.image_key ?? "")
        } catch (error) {
            console.error("==== CANNOT DELETE FILE", error)
        }
        await db.delete(image).where(eq(image.id, parseInt(id)))
        await db.delete(book).where(eq(book.image_id, parseInt(id)))
        return redirect(302, "/")
    }
};

