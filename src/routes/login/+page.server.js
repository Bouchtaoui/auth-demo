import { zod } from 'sveltekit-superforms/adapters';
import { lucia as auth } from '$lib/server/auth/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { setMessage, superValidate } from 'sveltekit-superforms';
import { drizzleDb as db } from '$lib/server/database/drizzle';
import { userTable as user } from '$lib/server/database/authSchema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { loginSchema } from '$lib/server/zods/signinSchema';
// import { logging } from '$lib/server/logging';
// import { serverEnv } from '$lib/server/serverEnv';
// import { authGuard } from '$lib/authGuard/authGuardConfig';


/** @type {import('./$types').PageServerLoad} */
export async function load(data) {
	
	// authGuard(data);
	
	const form = await superValidate(zod(loginSchema));

	return { form, enableSignup: true };
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(loginSchema));

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			const existingUser = await db
				.select()
				.from(user)
				.where(eq(user.email, form.data.email.toLowerCase()))
				.execute();
			if (existingUser.length === 0 || existingUser.length > 1) {
				await new Argon2id().hash(form.data.password);
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}

			const targetUser = existingUser[0];

			const validPassword = await new Argon2id().verify(
				targetUser.hashedPassword,
				form.data.password
			);

			if (!validPassword) {
				return setMessage(form, 'Incorrect username or password', { status: 400 });
			}

			const session = await auth.createSession(targetUser.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			// logging.error('Error Logging In', e);
			return setMessage(form, 'Incorrect username or password', { status: 400 });
		}
		redirect(302, '/');
	}
};
