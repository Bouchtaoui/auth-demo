import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import sqlite from "better-sqlite3";
import { dev } from "$app/environment";

const db = sqlite('../data/db.sqlite3', {
	verbose: console.log
});

const adapter = new BetterSqlite3Adapter(db, {
	user: "user",
	session: "session"
});


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}
