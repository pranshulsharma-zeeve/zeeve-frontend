declare module "react-syntax-highlighter" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  interface SyntaxHighlighterProps {
    children?: ReactNode;
    language?: string;
    style?: unknown;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    PreTag?: ComponentType<{ children: ReactNode }>;
    customStyle?: CSSProperties;
    [key: string]: unknown;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  const styles: Record<string, unknown>;
  export = styles;
}
