"use client";
import React from "react";

const GradientBackground = () => {
  return (
    <div className="relative min-h-full flex-1">
      <div className="absolute right-[12.5%] top-[11%] size-[6.25%] -rotate-45 bg-clip-path-blue blur-[100px]" />
      <div className="absolute -left-5 -top-5 size-[27.77%] -rotate-45 bg-clip-path-green blur-[161px]" />
      <div className="bg-clip-path-gradient absolute left-[35%] top-[35%] size-[22.22%] rotate-[135deg] blur-[161px]" />
      <div className="absolute bottom-[30%] right-36 size-[24.30%] -rotate-45 bg-clip-path-purple blur-[161px]" />
    </div>
  );
};

export default GradientBackground;
