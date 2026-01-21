import React, { useEffect, useRef } from 'react';

const LiveAudioVisualizer = ({ isActive, barColor = "#22c55e", volumeLevel = 0 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        const bars = 20;
        const barWidth = canvas.width / bars;

        const drawRoundedRect = (x, y, width, height, radius) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bars; i++) {
                const randomFactor = Math.random() * 0.5 + 0.5;
                const baseHeight = (volumeLevel / 1.5 + 0.05) * canvas.height;
                const height = Math.min(baseHeight * randomFactor * (1 + Math.sin(Date.now() / 100 + i) * 0.2), canvas.height);

                ctx.fillStyle = barColor;

                const x = i * barWidth + (barWidth - 4) / 2;
                const width = 4;
                const y = (canvas.height - height) / 2;

                drawRoundedRect(x, y, width, height, 2);
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, [isActive, barColor, volumeLevel]);

    if (!isActive) {
        return (
            <div className="h-12 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            </div>
        )
    }

    return (
        <canvas
            ref={canvasRef}
            width={160}
            height={48}
            className="opacity-90"
        />
    );
};

export default LiveAudioVisualizer;