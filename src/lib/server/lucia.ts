/**
 * Before we use Drizzle to work with a database, we need
 * to use Drizzle-kit to convert a schema to real tables.
 * There are 2 commands for that: generate & push
 * Read Drizzle doc for more info.
 */
import { dev } from '$app/environment';
import { Lucia } from 'lucia';
import { drizzleDb } from './database/drizzle';
import { userTable, sessionTable } from "./database/authSchema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

/**
 * Lucia works with adapters who's responsible for communicating
 * with databases. There are several adapters, but in our case,
 * we use DrizzleSQLiteAdapter, because drizzleDb is initialised
 * with a SQLite database.
 */
const drizzleAdapter = new DrizzleSQLiteAdapter(drizzleDb, sessionTable, userTable);

/**
 * We create a Lucia instance, that is responsible for setting cookies
 * amongst other things.
 */
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
