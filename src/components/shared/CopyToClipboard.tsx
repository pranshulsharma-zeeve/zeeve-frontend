"use client";
import React, { useCallback, useState } from "react";

interface CopyToClipboardProps {
  value: string;
  children?: React.ReactNode;
}

const CopyToClipboard = ({ value, children }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [value]);

  return (
    <button onClick={copy} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/15">
      {copied ? "Copied!" : (children ?? "Copy")}
    </button>
  );
};

export default CopyToClipboard;
