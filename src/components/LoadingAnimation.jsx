import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ onComplete, duration = 2000 }) => {
  const [glitchText, setGlitchText] = useState("OVERBOOKED");
  const glitchChars = "_/\\[]{}=+*^?#%$@";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    // Glitch effect interval
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to glitch
        const position = Math.floor(Math.random() * "OVERBOOKED".length);
        const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setGlitchText(prev => 
          prev.substring(0, position) + glitchChar + prev.substring(position + 1)
        );
        // Reset after a short delay
        setTimeout(() => {
          setGlitchText("OVERBOOKED");
        }, 50);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
    };
  }, [onComplete, duration]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { 
      y: 20, 
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative flex"
      >
        {glitchText.split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={item}
            className="text-7xl md:text-9xl font-thin tracking-wider relative inline-block font-mono"
            style={{
              textShadow: `
                0 0 10px rgba(0, 255, 255, 0.5),
                0 0 20px rgba(0, 255, 255, 0.3),
                0 0 30px rgba(0, 255, 255, 0.2),
                0 0 40px rgba(0, 255, 255, 0.1)
              `,
              color: 'rgba(255, 255, 255, 0.9)',
              animation: 'glitch 4s infinite'
            }}
          >
            {letter}
          </motion.span>
        ))}
        <div 
          className="absolute inset-0 blur-3xl opacity-30"
          style={{
            background: 'linear-gradient(45deg, #00ffff 0%, #0066ff 100%)',
            filter: 'blur(70px)',
            transform: 'translate(-10px, 10px)',
            zIndex: -1
          }}
        />
      </motion.div>

      <style jsx global>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, .75),
                        -0.025em -0.05em 0 rgba(0, 255, 0, .75),
                        0.025em 0.05em 0 rgba(0, 0, 255, .75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, .75),
                        -0.025em -0.05em 0 rgba(0, 255, 0, .75),
                        0.025em 0.05em 0 rgba(0, 0, 255, .75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, .75),
                        0.025em 0.025em 0 rgba(0, 255, 0, .75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, .75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, .75),
                        0.025em 0.025em 0 rgba(0, 255, 0, .75),
                        -0.05em -0.05em 0 rgba(0, 0, 255, .75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, .75),
                        0.05em 0 0 rgba(0, 255, 0, .75),
                        0 -0.05em 0 rgba(0, 0, 255, .75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, .75),
                        0.05em 0 0 rgba(0, 255, 0, .75),
                        0 -0.05em 0 rgba(0, 0, 255, .75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, .75),
                        -0.025em -0.025em 0 rgba(0, 255, 0, .75),
                        -0.025em -0.05em 0 rgba(0, 0, 255, .75);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;