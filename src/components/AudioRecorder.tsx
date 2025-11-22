"use client";

import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useState } from "react";
import { useRecordingStore } from "@/store/useRecordingStore";
import { Mic, Square, Pause, Play } from "lucide-react";

interface AudioRecorderProps {
    autoStart?: boolean;
    onStop?: (blobUrl: string, blob: Blob) => void;
}

export function AudioRecorder({ autoStart = false, onStop }: AudioRecorderProps) {
    const {
        status,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        mediaBlobUrl,
        previewStream,
    } = useReactMediaRecorder({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
        askPermissionOnMount: true,
        blobPropertyBag: {
            type: "audio/webm;codecs=opus",
        },
        onStop: (blobUrl, blob) => {
            if (onStop) onStop(blobUrl, blob);
        },
    });

    const {
        isRecording,
        isPaused,
        setDuration,
        startRecording: startStoreRecording,
        stopRecording: stopStoreRecording,
        pauseRecording: pauseStoreRecording,
        resumeRecording: resumeStoreRecording,
        resetRecording,
    } = useRecordingStore();

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Reset recording state when component mounts to ensure clean state
        resetRecording();
    }, [resetRecording]);

    useEffect(() => {
        if (autoStart && status === "idle") {
            startRecording();
            startStoreRecording();
        }
    }, [autoStart, status, startRecording, startStoreRecording]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "recording") {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        setDuration(elapsedTime);
    }, [elapsedTime, setDuration]);

    const handleStart = () => {
        startRecording();
        startStoreRecording();
        setElapsedTime(0);
    };

    const handlePause = () => {
        pauseRecording();
        pauseStoreRecording();
    };

    const handleResume = () => {
        resumeRecording();
        resumeStoreRecording();
    };

    const handleStop = () => {
        stopRecording();
        // stopStoreRecording is called in the onStop callback with the blob
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="w-full space-y-6">
            {/* Main Recording Area - Thinner Design */}
            <div className="relative">
                {!isRecording ? (
                    /* Ready State - Minimalist */
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="bg-white dark:bg-gray-900 rounded-full p-3 shadow-md border border-gray-200 dark:border-gray-700">
                                    <Mic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </div>
                                <div className="flex-1 md:flex-none">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Ready to Record
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Click start to begin capturing audio
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleStart}
                                className="w-full md:w-auto group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Mic className="w-5 h-5" />
                                    <span>Start Recording</span>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Recording State - Minimalist */
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black border border-gray-800 dark:border-gray-700 p-4 md:p-6">
                        {/* Animated background */}
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                    <span className="text-lg font-semibold text-white tracking-wide">
                                        RECORDING
                                    </span>
                                </div>
                                <div className="hidden sm:block h-8 w-px bg-white/20" />
                                <div className="bg-white/5 backdrop-blur-xl rounded-lg px-6 py-2 border border-white/10">
                                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                                        {formatTime(elapsedTime)}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                                {!isPaused ? (
                                    <button
                                        onClick={handlePause}
                                        className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Pause className="w-4 h-4" />
                                            <span className="hidden sm:inline">Pause</span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleResume}
                                        className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Play className="w-4 h-4" />
                                            <span className="hidden sm:inline">Resume</span>
                                        </div>
                                    </button>
                                )}

                                <button
                                    onClick={handleStop}
                                    className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Square className="w-4 h-4" />
                                        <span className="hidden sm:inline">Stop & Process</span>
                                        <span className="sm:hidden">Stop</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Status Text */}
                        {isPaused && (
                            <div className="mt-3 text-center">
                                <p className="text-sm text-gray-400">Recording paused</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
