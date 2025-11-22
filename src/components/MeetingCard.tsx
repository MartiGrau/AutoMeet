"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMeeting, updateMeetingTitle } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Meeting {
    id: string;
    title: string;
    createdAt: Date | null;
    expiresAt: Date | null;
    summary: string | null;
}

export function MeetingCard({ meeting }: { meeting: Meeting }) {
    const router = useRouter();
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(meeting.title);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await updateMeetingTitle(meeting.id, newTitle);
            setIsRenameOpen(false);
            router.refresh();
        } catch (error) {
            alert("Failed to rename meeting");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleteOpen(false);
        try {
            await deleteMeeting(meeting.id);
            // The redirect will happen from the server action
        } catch (error) {
            // redirect() throws a NEXT_REDIRECT error which is expected
            if (error && typeof error === 'object' && 'digest' in error) {
                return;
            }
            alert("Failed to delete meeting");
        }
    };

    return (
        <>
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-full relative group">
                <div className="absolute top-4 right-4 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.preventDefault()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsRenameOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDeleteOpen(true);
                                }}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Link href={`/meetings/${meeting.id}`}>
                    <CardHeader>
                        <CardTitle className="truncate pr-8">{meeting.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {meeting.createdAt
                                    ? new Date(meeting.createdAt).toLocaleDateString()
                                    : "Unknown Date"}
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                                {meeting.expiresAt
                                    ? `Expires: ${new Date(meeting.expiresAt).toLocaleDateString()}`
                                    : "No Expiry"}
                            </span>
                        </div>
                        {meeting.summary && (
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                <FileText className="w-4 h-4 inline mr-1" />
                                {meeting.summary.replace(/\*\*/g, "")}
                            </div>
                        )}
                    </CardContent>
                </Link>
            </Card>

            {/* Rename Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rename Meeting</DialogTitle>
                        <DialogDescription>
                            Enter a new name for this meeting.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRename}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Meeting Title</Label>
                                <Input
                                    id="title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRenameOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
        </>
    );
}
