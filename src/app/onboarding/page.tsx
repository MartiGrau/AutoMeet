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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { saveIntegrationConfig } from "@/app/actions";
import { useState } from "react";

export default function OnboardingPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const res = await saveIntegrationConfig(formData);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to AutoMeet AI</CardTitle>
                    <CardDescription>
                        To get started, please configure your LLM provider.
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="provider">LLM Provider</Label>
                            <Select name="provider" required defaultValue="gemini">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini">Google Gemini</SelectItem>
                                    <SelectItem value="openai">OpenAI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input
                                id="apiKey"
                                name="apiKey"
                                type="password"
                                placeholder="Enter your API Key"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                Your API key is stored securely and used only for processing your
                                meetings.
                            </p>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Save & Continue
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
