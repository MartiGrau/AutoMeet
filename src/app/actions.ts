"use server";

import { hash } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        return { error: "User already exists" };
    }

    const passwordHash = await hash(password, 10);
    const id = uuidv4();

    await db.insert(users).values({
        id,
        email,
        passwordHash,
        preferences: {
            retentionDays: 30,
            defaultTemplate: "Summarize into Key Decisions, Action Items, Open Questions",
        },
    });

    redirect("/login");
}

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
}

import { integrationConfigs } from "@/db/schema";
import { auth } from "@/auth";

export async function saveIntegrationConfig(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const provider = formData.get("provider") as "gemini" | "openai";
    const apiKey = formData.get("apiKey") as string;

    if (!provider || !apiKey) {
        return { error: "Provider and API Key are required" };
    }

    const id = uuidv4();

    // Check if config exists
    const existingConfig = await db
        .select()
        .from(integrationConfigs)
        .where(eq(integrationConfigs.userId, session.user.id))
        .limit(1);

    if (existingConfig.length > 0) {
        await db
            .update(integrationConfigs)
            .set({ provider, apiKey, updatedAt: new Date() })
            .where(eq(integrationConfigs.userId, session.user.id));
    } else {
        await db.insert(integrationConfigs).values({
            id,
            userId: session.user.id,
            provider,
            apiKey,
        });
    }

    redirect("/dashboard");
}

import { meetings } from "@/db/schema";

export async function deleteMeeting(meetingId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    await db
        .delete(meetings)
        .where(and(eq(meetings.id, meetingId), eq(meetings.userId, session.user.id)));

    redirect("/meetings");
}

export async function sendMeetingEmail(meetingId: string, email: string) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
        return { error: "Unauthorized" };
    }

    // Get meeting details
    const [meeting] = await db
        .select()
        .from(meetings)
        .where(and(eq(meetings.id, meetingId), eq(meetings.userId, session.user.id)))
        .limit(1);

    if (!meeting) {
        return { error: "Meeting not found" };
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured");
        return { error: "Email service not configured. Please add RESEND_API_KEY to your .env.local file." };
    }

    try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: `AutoMeet <onboarding@resend.dev>`, // You'll need to verify your domain in Resend
            to: email,
            replyTo: session.user.email,
            subject: `Meeting Summary: ${meeting.title}`,
            html: `
                <h1>${meeting.title}</h1>
                <p><strong>Date:</strong> ${new Date(meeting.createdAt!).toLocaleString()}</p>
                
                <h2>Transcript</h2>
                <p>${meeting.transcript || "No transcript available"}</p>
                
                <h2>Summary</h2>
                <div>${meeting.summary || "No summary available"}</div>
                
                <hr />
                <p style="color: #666; font-size: 12px;">
                    This email was sent from AutoMeet by ${session.user.email}
                </p>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { error: error instanceof Error ? error.message : "Failed to send email" };
    }
}

export async function updateSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const retentionDays = parseInt(formData.get("retentionDays") as string);
    const defaultTemplate = formData.get("defaultTemplate") as string;

    await db
        .update(users)
        .set({
            preferences: {
                retentionDays,
                defaultTemplate,
            },
        })
        .where(eq(users.id, session.user.id));

    redirect("/settings");
}

export async function updateMeetingTitle(meetingId: string, newTitle: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    await db
        .update(meetings)
        .set({ title: newTitle })
        .where(and(eq(meetings.id, meetingId), eq(meetings.userId, session.user.id)));

    return { success: true };
}
