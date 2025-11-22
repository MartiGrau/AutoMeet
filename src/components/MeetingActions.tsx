"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Mail, Send } from "lucide-react";
import { deleteMeeting, sendMeetingEmail } from "@/app/actions";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function MeetingActions({ meetingId }: { meetingId: string }) {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDelete = async () => {
        console.log("Delete confirmed, meetingId:", meetingId);
        setIsDeleteOpen(false);

        try {
            console.log("Calling deleteMeeting...");
            await deleteMeeting(meetingId);
            // redirect() throws, so this won't execute normally
        } catch (error) {
            console.log("Error caught:", error);

            // redirect() throws a NEXT_REDIRECT error which is expected
            if (error && typeof error === 'object' && 'digest' in error) {
                console.log("This is a Next.js redirect, allowing it");
                return;
            }
            console.error("Actual error:", error);
            alert("Failed to delete meeting");
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await sendMeetingEmail(meetingId, email);
            alert("Email sent successfully!");
            setIsEmailOpen(false);
            setEmail("");
        } catch (error) {
            alert("Failed to send email.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Mail className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Email Summary</span>
                        <span className="sm:hidden ml-2">Email</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send Meeting Summary</DialogTitle>
                        <DialogDescription>
                            Enter the email address to send the meeting transcript and summary.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendEmail}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSending}>
                                {isSending ? "Sending..." : "Send Email"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                        <Trash2 className="w-4 h-4 sm:mr-2" />
                        <span className="ml-2">Delete</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Meeting</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this meeting? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
