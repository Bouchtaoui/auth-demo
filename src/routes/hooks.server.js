import { lucia } from '$lib/server/auth/lucia';

/**
 * Handles authentication per request
 * @param {import('@sveltejs/kit').RequestEvent} event 
 */
async function handleAuth(event) {
    const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = undefined;
		event.locals.session = undefined;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user || undefined;
	event.locals.session = session || undefined;
}

/** @type {import('@sveltejs/kit').Handle} */ 
export async function handle({ event, resolve }) {

    await handleAuth(event);

    const response = await resolve(event);

    return response;
}
