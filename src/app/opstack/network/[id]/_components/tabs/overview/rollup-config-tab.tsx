"use client";
import React from "react";
import { Spinner, tx } from "@zeeve-platform/ui";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as theme from "react-syntax-highlighter/dist/esm/styles/prism";
type GeneralProps = {
  data?: Record<string, string> | undefined;
  isLoading: boolean;
};

const RollUpConfigTab = ({ data, isLoading }: GeneralProps) => {
  return (
    <div
      className={tx("col-span-12 row-span-3 flex max-h-44 flex-col rounded-lg border border-brand-outline", {
        "h-44": data,
      })}
    >
      {data && !isLoading && (
        <SyntaxHighlighter
          customStyle={{
            fontSize: "12px",
            backgroundColor: "transparent",
            padding: "0",
            margin: "0",
          }}
          language="json"
          style={theme.solarizedlight}
        >
          {JSON.stringify(data, null, 4)}
        </SyntaxHighlighter>
      )}
      {!data && !isLoading && (
        <div className="flex h-screen items-center justify-center text-sm text-brand-gray">No data available.</div>
      )}
      {isLoading && (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default RollUpConfigTab;
