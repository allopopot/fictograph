import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { image } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { signUrl } from '$lib/server/s3';

const limit = 9

export const load = (async (event) => {
    if (!event.locals.user?.id) {
        return {};
    }
    const images = await db.select().from(image).where(eq(image.user_id, event.locals.user?.id)).limit(limit).orderBy(desc(image.createdAt))
    await Promise.all(images.map(async ax => {
        if (ax.image_key) {
            ax.image_key = await signUrl(ax.image_key)
        }
    }))

    return { images, limit };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signout: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/signin');
    }
};