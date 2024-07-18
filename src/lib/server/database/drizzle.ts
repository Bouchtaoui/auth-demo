/**
 * Here we create a drizzle instance to communicate, in this
 * case, with a sqlite database.
*/

import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqliteDB = sqlite('data/sqlite.db');

export const drizzleDb = drizzle(sqliteDB);


