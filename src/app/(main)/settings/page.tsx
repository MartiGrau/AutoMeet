import { auth } from "@/auth";
import { db } from "@/db";
import { users, integrationConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    const [config] = await db
        .select()
        .from(integrationConfigs)
        .where(eq(integrationConfigs.userId, session.user.id))
        .limit(1);

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

            <div className="space-y-6">
                <SettingsForm
                    retentionDays={user?.preferences?.retentionDays || 30}
                    defaultTemplate={
                        user?.preferences?.defaultTemplate ||
                        "Summarize into Key Decisions, Action Items, Open Questions"
                    }
                />

                <Card>
                    <CardHeader>
                        <CardTitle>LLM Integration</CardTitle>
                        <CardDescription>
                            Update your API Key and Provider settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Provider</Label>
                            <Input disabled value={config?.provider || "Not configured"} />
                        </div>
                        <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input
                                disabled
                                type="password"
                                value={config?.apiKey ? "••••••••••••••••" : ""}
                                placeholder="Not configured"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" asChild>
                            <a href="/onboarding">Reconfigure Integration</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
