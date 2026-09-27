import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    signout: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/signin');
    }
};