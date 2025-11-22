import { createClient } from "@libsql/client";
import * as fs from "fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
    url,
    authToken,
});

async function initDatabase() {
    console.log("Initializing Turso database...");

    const sql = fs.readFileSync("./drizzle/0000_flippant_boom_boom.sql", "utf-8");
    const statements = sql
        .split("--> statement-breakpoint")
        .map(s => s.trim())
        .filter(s => s && s.length > 0);

    for (const statement of statements) {
        try {
            const preview = statement.substring(0, 60).replace(/\n/g, " ");
            console.log("Executing:", preview + "...");
            await client.execute(statement);
            console.log("✓ Success");
        } catch (error: any) {
            if (error.message?.includes("already exists")) {
                console.log("✓ Already exists, skipping...");
            } else {
                console.error("✗ Error:", error.message);
                throw error;
            }
        }
    }

    console.log("Database initialized successfully!");
    process.exit(0);
}

initDatabase().catch((err) => {
    console.error("Error initializing database:", err);
    process.exit(1);
});
