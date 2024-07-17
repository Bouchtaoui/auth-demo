import { dev } from '$app/environment';
import { Lucia } from 'lucia';
import { drizzleAdapter } from './database/drizzle';


export const lucia = new Lucia(drizzleAdapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},

	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			userId: attributes.userId,
			admin: Boolean(attributes.admin)
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes {
	userId: string;
	email: string;
	admin: boolean;
}
