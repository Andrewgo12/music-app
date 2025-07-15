import { useEffect, useRef, useState } from 'react';
// import { motion } from 'framer-motion'; // Not used

const AudioVisualizer = ({
  isPlaying,
  currentSong,
  visualizerType = 'bars',
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [audioData, setAudioData] = useState(new Array(64).fill(0));

  useEffect(() => {
    if (isPlaying && currentSong) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => stopVisualization();
  }, [isPlaying, currentSong, visualizerType, startVisualization, stopVisualization]); // Added missing dependencies

  const generateRandomAudioData = () => {
    // Simulate audio frequency data
    return new Array(64).fill(0).map((_, index) => {
      const baseFreq = Math.sin(Date.now() * 0.001 + index * 0.1) * 0.5 + 0.5;
      const randomVariation = Math.random() * 0.3;
      const decay = Math.exp(-index * 0.05); // Higher frequencies decay
      return (baseFreq + randomVariation) * decay * 255;
    });
  };

  const startVisualization = () => {
    const animate = () => {
      if (isPlaying) {
        const newAudioData = generateRandomAudioData();
        setAudioData(newAudioData);
        drawVisualization(newAudioData);
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    // Fade out visualization
    const fadeOut = () => {
      setAudioData(prev => prev.map(val => val * 0.95));
      const canvas = canvasRef.current;
      if (canvas) {
        drawVisualization(audioData.map(val => val * 0.95));
        if (Math.max(...audioData) > 1) {
          requestAnimationFrame(fadeOut);
        } else {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
    fadeOut();
  };

  const drawVisualization = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    switch (visualizerType) {
      case 'bars':
        drawBars(ctx, data, width, height);
        break;
      case 'wave':
        drawWave(ctx, data, width, height);
        break;
      case 'circular':
        drawCircular(ctx, data, width, height);
        break;
      case 'particles':
        drawParticles(ctx, data, width, height);
        break;
      default:
        drawBars(ctx, data, width, height);
    }
  };

  const drawBars = (ctx, data, width, height) => {
    const barWidth = width / data.length;
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#34d399');
    gradient.addColorStop(1, '#6ee7b7');

    data.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      // Add glow effect
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      ctx.shadowBlur = 0;
    });
  };

  const drawWave = (ctx, data, width, height) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    data.forEach((value, index) => {
      const y = height / 2 + ((value - 128) / 128) * (height / 2);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    });

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawCircular = (ctx, data, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    data.forEach((value, index) => {
      const angle = (index / data.length) * Math.PI * 2;
      const barHeight = (value / 255) * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#6ee7b7');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // Draw center circle
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawParticles = (ctx, data, width, height) => {
    data.forEach((value, index) => {
      const intensity = value / 255;
      const numParticles = Math.floor(intensity * 5);

      for (let i = 0; i < numParticles; i++) {
        const x = (index / data.length) * width + Math.random() * 20 - 10;
        const y = height - (intensity * height * 0.8) + Math.random() * 20 - 10;
        const size = intensity * 3 + 1;

        const alpha = intensity * 0.8;
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-lg bg-gray-900 ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="w-16 h-16 mx-auto mb-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <p className="text-sm">Play music to see visualization</p>
          </div>
        </div>
      )}

      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default AudioVisualizer;
