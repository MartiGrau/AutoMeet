import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(), // UUID
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    preferences: text("preferences", { mode: "json" }).$type<{
        retentionDays: number;
        defaultTemplate: string;
    }>(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const integrationConfigs = sqliteTable("integration_configs", {
    id: text("id").primaryKey(), // UUID
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider", { enum: ["gemini", "openai"] }).notNull(),
    apiKey: text("api_key").notNull(), // Encrypted ideally, but plain text for MVP as per prompt "assume encryption logic needed"
    emailConfig: text("email_config", { mode: "json" }).$type<{
        smtpHost?: string;
        smtpPort?: number;
        smtpUser?: string;
        smtpPass?: string;
    }>(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const meetings = sqliteTable("meetings", {
    id: text("id").primaryKey(), // UUID
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Untitled Meeting"),
    audioUrl: text("audio_url"),
    transcript: text("transcript"),
    summary: text("summary"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const labels = sqliteTable("labels", {
    id: text("id").primaryKey(), // UUID
    meetingId: text("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    tagName: text("tag_name").notNull(),
});
