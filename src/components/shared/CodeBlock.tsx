"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  code: string;
  className?: string;
}

const CodeBlock = ({ language = "bash", code, className }: CodeBlockProps) => {
  return (
    <div className={className}>
      <SyntaxHighlighter language={language} style={oneDark} customStyle={{ borderRadius: 8, padding: 16 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
