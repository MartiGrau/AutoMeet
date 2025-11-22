"use client";

import dynamic from "next/dynamic";
const AudioRecorder = dynamic(
    () => import("@/components/AudioRecorder").then((mod) => mod.AudioRecorder),
    { ssr: false }
);
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecordingStore } from "@/store/useRecordingStore";

export function MeetingManager() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const { resetRecording } = useRecordingStore();

    const handleStop = async (blobUrl: string, blob: Blob) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("audio", blob, "meeting.webm");

        try {
            const res = await fetch("/api/process-meeting", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Meeting processed:", data.meetingId);
                // Reset recording state before navigating
                resetRecording();
                alert("Meeting processed successfully!");
                router.push(`/meetings/${data.meetingId}`);
            } else {
                const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
                console.error("Failed to process meeting:", errorData);
                alert(`Failed to process meeting: ${errorData.error || "Unknown error"}`);
                // Reset on error too
                resetRecording();
            }
        } catch (error) {
            console.error("Error uploading meeting:", error);
            alert(`Error uploading meeting: ${error instanceof Error ? error.message : "Unknown error"}`);
            // Reset on error
            resetRecording();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {isProcessing && (
                <div className="mb-4 text-blue-500 animate-pulse">
                    Processing meeting...
                </div>
            )}
            <AudioRecorder autoStart={false} onStop={handleStop} />
        </div>
    );
}
