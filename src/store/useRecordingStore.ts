import { create } from "zustand";

interface RecordingState {
    isRecording: boolean;
    isPaused: boolean;
    audioBlob: Blob | null;
    duration: number;
    startRecording: () => void;
    stopRecording: (blob: Blob) => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    resetRecording: () => void;
    setDuration: (duration: number) => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
    isRecording: false,
    isPaused: false,
    audioBlob: null,
    duration: 0,
    startRecording: () => set({ isRecording: true, isPaused: false, audioBlob: null, duration: 0 }),
    stopRecording: (blob) => set({ isRecording: false, isPaused: false, audioBlob: blob }),
    pauseRecording: () => set({ isPaused: true }),
    resumeRecording: () => set({ isPaused: false }),
    resetRecording: () => set({ isRecording: false, isPaused: false, audioBlob: null, duration: 0 }),
    setDuration: (duration) => set({ duration }),
}));
