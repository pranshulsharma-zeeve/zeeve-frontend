"use client";
import React from "react";
import ZeeveLoader from "./ZeeveLoader";

const LoadingScreen = () => {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <ZeeveLoader label="Loading..." />
    </div>
  );
};

export default LoadingScreen;
