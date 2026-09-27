import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
    if (!!event.locals.user) {
        return redirect(302, "/")
    }
}) satisfies LayoutServerLoad;