"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
}

export function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        if (!stream || !isRecording || !canvasRef.current) return;
        if (stream.getAudioTracks().length === 0) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        source.connect(analyser);
        analyser.fftSize = 256;

        analyserRef.current = analyser;
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgb(20, 20, 20)"; // Dark background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            if (analyserRef.current) analyserRef.current.disconnect();
            if (audioContext.state !== "closed") audioContext.close();
        };
    }, [stream, isRecording]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg shadow-lg bg-gray-900"
            width={800}
            height={300}
        />
    );
}
