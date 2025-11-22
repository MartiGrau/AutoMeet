import { auth } from "@/auth";
import { db } from "@/db";
import { integrationConfigs, meetings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { MeetingManager } from "@/components/MeetingManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Clock, FileText, Zap } from "lucide-react";

// Force dynamic rendering to always show fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [config] = await db
        .select()
        .from(integrationConfigs)
        .where(eq(integrationConfigs.userId, session.user.id))
        .limit(1);

    if (!config) {
        redirect("/onboarding");
    }

    // Get recent meetings ordered by creation date
    const recentMeetings = await db
        .select()
        .from(meetings)
        .where(eq(meetings.userId, session.user.id))
        .orderBy(desc(meetings.createdAt))
        .limit(5);

    const features = [
        {
            icon: Mic,
            title: "High-Quality Recording",
            description: "Crystal clear audio capture with noise suppression",
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
        },
        {
            icon: Zap,
            title: "AI-Powered Transcription",
            description: "Automatic transcription using OpenAI Whisper",
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
        },
        {
            icon: FileText,
            title: "Smart Summaries",
            description: "Get concise meeting summaries instantly",
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
        },
        {
            icon: Clock,
            title: "Real-Time Processing",
            description: "Fast transcription and summary generation",
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to AutoMeet
                </h1>
                <p className="text-lg text-muted-foreground">
                    Record, transcribe, and summarize your meetings with AI
                </p>
            </div>

            {/* Recording Section */}
            <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Mic className="w-6 h-6 text-primary" />
                        </div>
                        Start Recording
                    </CardTitle>
                    <CardDescription>
                        Click the record button below to start capturing your meeting
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MeetingManager />
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <Card key={feature.title} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className={`p-3 rounded-lg w-fit ${feature.bgColor}`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Meetings */}
            {recentMeetings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Meetings</CardTitle>
                        <CardDescription>
                            Your last {recentMeetings.length} recorded meetings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentMeetings.map((meeting) => (
                                <a
                                    key={meeting.id}
                                    href={`/meetings/${meeting.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{meeting.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {meeting.createdAt
                                                    ? new Date(meeting.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "Unknown date"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {meeting.transcript?.split(/\s+/).length || 0} words
                                    </div>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Quick Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm">
                        <strong>•</strong> Speak clearly and at a moderate pace for best transcription results
                    </p>
                    <p className="text-sm">
                        <strong>•</strong> The app supports multiple languages including Spanish and Catalan
                    </p>
                    <p className="text-sm">
                        <strong>•</strong> You can email meeting summaries directly from the meeting detail page
                    </p>
                    <p className="text-sm">
                        <strong>•</strong> Check the Analytics page to track your meeting statistics
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
