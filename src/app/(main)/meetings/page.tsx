import { auth } from "@/auth";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { MeetingCard } from "@/components/MeetingCard";

export default async function MeetingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const userMeetings = await db
        .select()
        .from(meetings)
        .where(eq(meetings.userId, session.user.id))
        .orderBy(desc(meetings.createdAt));

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Meeting History</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
                {userMeetings.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No meetings recorded yet. Go to the dashboard to start recording.
                    </div>
                )}
            </div>
        </div>
    );
}
