import { auth } from "@/auth";
import { db } from "@/db";
import { integrationConfigs, meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export async function POST(req: Request) {
    console.log("=== POST /api/process-meeting START ===");

    const session = await auth();
    console.log("Session:", session?.user?.id ? "Authenticated" : "Not authenticated");

    if (!session?.user?.id) {
        console.log("ERROR: Unauthorized");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    console.log("Audio file:", audioFile ? `${audioFile.name} (${audioFile.size} bytes, ${audioFile.type})` : "No file");

    if (!audioFile) {
        console.log("ERROR: No audio file provided");
        return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Get user's LLM config
    console.log("Fetching LLM config for user:", session.user.id);
    const [config] = await db
        .select()
        .from(integrationConfigs)
        .where(eq(integrationConfigs.userId, session.user.id))
        .limit(1);

    console.log("LLM config:", config ? `Provider: ${config.provider}` : "Not found");

    if (!config || !config.apiKey) {
        console.log("ERROR: LLM configuration missing");
        return NextResponse.json(
            { error: "LLM configuration missing" },
            { status: 400 }
        );
    }

    try {
        let transcript = "";
        let summary = "";

        // Use OpenAI Whisper for transcription (works for both providers)
        console.log("Using OpenAI Whisper for transcription");
        const openai = new OpenAI({ apiKey: config.apiKey });

        // Convert File to proper format for OpenAI
        console.log("Preparing audio file for Whisper...");
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Whisper supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
        // Create a File object with proper extension
        let fileName = "meeting.webm";
        let mimeType = audioFile.type || "audio/webm";

        // If it's wav, use .wav extension
        if (mimeType.includes("wav")) {
            fileName = "meeting.wav";
        } else if (mimeType.includes("mp3")) {
            fileName = "meeting.mp3";
        } else if (mimeType.includes("m4a")) {
            fileName = "meeting.m4a";
        }

        console.log(`Audio file: ${fileName}, MIME: ${mimeType}, Size: ${buffer.length} bytes`);
        const file = new File([buffer], fileName, { type: mimeType });

        console.log("Calling Whisper API for transcription...");
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1",
            // Language auto-detection enabled (supports Spanish, Catalan, etc.)
        });

        transcript = transcription.text;
        console.log("Transcription complete, length:", transcript.length);

        if (!transcript || transcript.length === 0) {
            throw new Error("Whisper returned empty transcription. The audio may be too short, silent, or in an unsupported format.");
        }

        console.log("Transcript preview:", transcript.substring(0, 200));

        // Use configured LLM for summary
        if (config.provider === "openai") {
            console.log("Using OpenAI GPT for summary");
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that creates concise meeting summaries. Always respond in the same language as the transcript."
                    },
                    {
                        role: "user",
                        content: `Please create a concise summary of this meeting transcript (respond in the same language as the transcript):\n\n${transcript}`
                    }
                ],
            });

            summary = completion.choices[0]?.message?.content || "Could not generate summary";
            console.log("Summary generated");

        } else if (config.provider === "gemini") {
            console.log("Using Gemini for summary");
            const genAI = new GoogleGenerativeAI(config.apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent([
                { text: `Please create a concise summary of this meeting transcript. Respond in the same language as the transcript:\n\n${transcript}` }
            ]);

            const response = await result.response;
            summary = response.text();
            console.log("Summary generated");
        }

        const meetingId = uuidv4();
        console.log("Saving meeting to database, ID:", meetingId);

        await db.insert(meetings).values({
            id: meetingId,
            userId: session.user.id,
            title: `Meeting on ${new Date().toLocaleDateString()}`,
            audioUrl: "TODO: Upload to S3/R2",
            transcript,
            summary,
        });

        console.log("Meeting saved successfully");
        console.log("=== POST /api/process-meeting SUCCESS ===");
        return NextResponse.json({ success: true, meetingId });
    } catch (error) {
        console.error("=== ERROR processing meeting ===");
        console.error("Error type:", error?.constructor?.name);
        console.error("Error message:", error instanceof Error ? error.message : String(error));
        console.error("Full error:", error);
        console.error("=== END ERROR ===");

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to process meeting" },
            { status: 500 }
        );
    }
}
