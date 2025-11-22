"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/app/actions";
import { useState } from "react";

interface SettingsFormProps {
    retentionDays: number;
    defaultTemplate: string;
}

export function SettingsForm({ retentionDays, defaultTemplate }: SettingsFormProps) {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const res = await updateSettings(formData);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Manage your meeting retention and summarization preferences.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="retentionDays">Retention (Days)</Label>
                        <Input
                            id="retentionDays"
                            name="retentionDays"
                            type="number"
                            min="1"
                            max="30"
                            defaultValue={retentionDays}
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Meetings older than this will be automatically deleted.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="defaultTemplate">System Prompt Template</Label>
                        <Textarea
                            id="defaultTemplate"
                            name="defaultTemplate"
                            rows={4}
                            defaultValue={defaultTemplate}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit">Save Preferences</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
