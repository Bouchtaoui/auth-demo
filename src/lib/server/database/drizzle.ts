
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { userTable, sessionTable } from "./authSchema";

const sqliteDB = sqlite('src/data/sqlite.db');
const db = drizzle(sqliteDB);



export const drizzleAdapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);