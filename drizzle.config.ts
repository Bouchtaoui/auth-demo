import { defineConfig } from 'drizzle-kit';


export default defineConfig({
    dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
    schema: './src/lib/server/database/authSchema.ts',
    out: './src/lib/server/database/migrations',
    dbCredentials: {
        url: './data/sqlite.db'
    }
});