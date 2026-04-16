"use client";
import { IconCheckCircle, IconXMarkCircle } from "@zeeve-platform/icons/essential/outline";
import React from "react";

const FlagState = ({ flag }: { flag?: boolean }) => {
  return (
    <>
      {flag ? (
        <div className="flex items-center">
          <IconCheckCircle className="mr-2 text-brand-green" />
          ENABLED
        </div>
      ) : (
        <div className="flex items-center">
          <IconXMarkCircle className="mr-2 text-brand-red" />
          DISABLED
        </div>
      )}
    </>
  );
};

export default FlagState;
