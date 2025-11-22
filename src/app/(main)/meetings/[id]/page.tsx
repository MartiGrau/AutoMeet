import { auth } from "@/auth";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingActions } from "@/components/MeetingActions";

export default async function MeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;
    if (!id) return notFound();

    const [meeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, id))
        .limit(1);

    if (!meeting) {
        notFound();
    }

    if (meeting.userId !== session.user.id) {
        redirect("/dashboard");
    }



    return (
        <div className="container mx-auto py-6 sm:py-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{meeting.title}</h1>
                <MeetingActions meetingId={meeting.id} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Transcript</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{meeting.transcript || "No transcript available."}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: meeting.summary?.replace(/\n/g, "<br/>") || "No summary available." }} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
