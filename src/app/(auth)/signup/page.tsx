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
import Link from "next/link";
import { signup } from "@/app/actions";
import { useState } from "react";

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const res = await signup(formData);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
