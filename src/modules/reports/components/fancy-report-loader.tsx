"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface FancyReportLoaderProps {
  initialMessage?: string;
  messages?: string[];
  delay?: number;
  messageChangeInterval?: number;
  className?: string;
}

const FancyReportLoader = ({
  initialMessage = "Loading report...",
  messages = [
    "Taking too long? Grab a cup of tea! ☕",
    "Great things take time... almost there! ⏳",
    "We're fetching your data... hang tight! 📊",
  ],
  delay = 4000,
  messageChangeInterval = 3000,
  className = "py-16",
}: FancyReportLoaderProps) => {
  const [message, setMessage] = useState(initialMessage);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasStartedRotation, setHasStartedRotation] = useState(false);
  const [messageOpacity, setMessageOpacity] = useState(1);

  // Start rotating messages after initial delay
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setHasStartedRotation(true);
      setMessageOpacity(0);
      setTimeout(() => {
        setMessage(messages[0]);
        setMessageIndex(0);
        setMessageOpacity(1);
      }, 300);
    }, delay);

    return () => clearTimeout(initialTimer);
  }, [delay, messages]);

  // Rotate through messages
  useEffect(() => {
    if (!hasStartedRotation) return;

    const rotationTimer = setInterval(() => {
      setMessageOpacity(0);
      setTimeout(() => {
        const nextIndex = (messageIndex + 1) % messages.length;
        setMessageIndex(nextIndex);
        setMessage(messages[nextIndex]);
        setMessageOpacity(1);
      }, 300);
    }, messageChangeInterval);

    return () => clearInterval(rotationTimer);
  }, [messageIndex, messages, messageChangeInterval, hasStartedRotation]);

  return (
    <div className={className}>
      <style>{`
        .fancy-loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-sm;
          font-weight: 500;
          color: #4B5365;
        }

        .fancy-message-text {
          transition: opacity 0.3s ease-in-out;
          opacity: ${messageOpacity};
          min-height: 20px;
        }
      `}</style>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="fancy-loader-wrapper">
        <Image
          src={withBasePath("/assets/images/loaders/zeeve-loader.gif")}
          alt="Zeeve loader"
          width={80}
          height={80}
          className="size-20"
          priority
        />
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="fancy-message-text">{message}</div>
      </div>
    </div>
  );
};

export default FancyReportLoader;
