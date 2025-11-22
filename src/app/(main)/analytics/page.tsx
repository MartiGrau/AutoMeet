import { auth } from "@/auth";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, FileText, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch all meetings for the user
    const userMeetings = await db
        .select()
        .from(meetings)
        .where(eq(meetings.userId, session.user.id));

    // Calculate statistics
    const totalMeetings = userMeetings.length;
    const totalTranscriptWords = userMeetings.reduce((sum, m) => {
        return sum + (m.transcript?.split(/\s+/).length || 0);
    }, 0);

    const avgTranscriptLength = totalMeetings > 0
        ? Math.round(totalTranscriptWords / totalMeetings)
        : 0;

    // Get meetings from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentMeetings = userMeetings.filter(m =>
        m.createdAt && new Date(m.createdAt) >= thirtyDaysAgo
    );

    // Calculate meetings per week (last 4 weeks)
    const meetingsPerWeek = Math.round((recentMeetings.length / 30) * 7);

    const stats = [
        {
            title: "Total Meetings",
            value: totalMeetings,
            description: "All time",
            icon: BarChart3,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
        },
        {
            title: "Recent Meetings",
            value: recentMeetings.length,
            description: "Last 30 days",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
        },
        {
            title: "Avg. Transcript Length",
            value: `${avgTranscriptLength} words`,
            description: "Per meeting",
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
        },
        {
            title: "Meetings per Week",
            value: meetingsPerWeek,
            description: "Average",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                    Track your meeting statistics and insights
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalMeetings > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your last 5 meetings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {userMeetings
                                .sort((a, b) => {
                                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                    return dateB - dateA;
                                })
                                .slice(0, 5)
                                .map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">{meeting.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {meeting.createdAt
                                                    ? new Date(meeting.createdAt).toLocaleDateString()
                                                    : "Unknown date"}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {meeting.transcript?.split(/\s+/).length || 0} words
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {totalMeetings === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No meetings yet</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Start recording meetings to see your analytics and insights here.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
