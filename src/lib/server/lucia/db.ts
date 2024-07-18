import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '$lib/server/lucia/schema';

const sqlite = new Database("src/lib/data/data.db");

export const db = drizzle(sqlite, { schema });

export interface DatabaseUser {
	id: string;
	email: string;
	password: string;
}
