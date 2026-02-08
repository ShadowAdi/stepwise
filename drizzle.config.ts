import { defineConfig } from 'drizzle-kit';
import { connectionString } from './db';

export default defineConfig({
    schema: "./db/schema.ts",
    out: './supabase/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: connectionString!
    }
})