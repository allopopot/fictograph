import z from 'zod';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';
import { auth } from "$lib/server/auth"

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


const SignInSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().trim(),
})

export const actions: Actions = {
    default: async function (event) {
        const formdata = await event.request.formData()
        const formBody = {
            email: formdata.get("email")?.toString(),
            password: formdata.get("password")?.toString(),
        }

        const zResult = SignInSchema.safeParse(formBody)

        if (zResult.error) {
            const errorTree = z.treeifyError(zResult.error)
            return fail(422, { ...errorTree, body: formBody })
        }

        try {
            await auth.api.signInEmail({
                body: { ...zResult.data }
            })
        } catch (error) {
            if (error instanceof APIError) {
                return fail(400, { message: error.message || 'Registration failed', body: formBody });
            }
            return fail(500, { message: 'Unexpected error', body: formBody });
        }
        return redirect(302, '/');

    }
};