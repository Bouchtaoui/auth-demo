import { Config, defineConfig } from "drizzle-kit";



export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/server/lucia/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: 'file:./src/lib/server/data/data.db',
  }
}) satisfies Config
