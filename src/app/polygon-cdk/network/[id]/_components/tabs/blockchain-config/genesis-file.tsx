"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Heading, IconButton, Spinner, Tooltip, tx } from "@zeeve-platform/ui";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as theme from "react-syntax-highlighter/dist/esm/styles/prism";
import { usePolygonCdkDashboard } from "../dashboard-context";
import { downloadFile } from "@/utils/helpers";

const GenesisFile = () => {
  const { id } = useParams();
  const networkId = id as string;
  const { normalized, blockchainDetails, isLoading } = usePolygonCdkDashboard();
  const genesisSource = useMemo(() => {
    if (normalized?.genesis !== undefined) return normalized.genesis;
    const artifact = blockchainDetails?.artifacts?.find((item) => item.name?.toLowerCase().includes("genesis"));
    return artifact?.content;
  }, [normalized?.genesis, blockchainDetails?.artifacts]);
  const formattedGenesis = useMemo(() => {
    if (!genesisSource) return undefined;
    if (typeof genesisSource === "string") return genesisSource;
    try {
      return JSON.stringify(genesisSource, null, 4);
    } catch {
      return undefined;
    }
  }, [genesisSource]);
  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline lg:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Genesis File</Heading>
          <Tooltip text={"Download Genesis File"} placement="top-start">
            <IconButton
              colorScheme="primary"
              variant={"ghost"}
              isDisabled={!formattedGenesis}
              onClick={() => {
                if (formattedGenesis) {
                  downloadFile(formattedGenesis, `${networkId}-genesis-file.json`);
                }
              }}
            >
              <IconDownload className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div
          className={tx("col-span-12 row-span-3 flex max-h-64 flex-col rounded-lg border border-brand-outline", {
            "h-48": !formattedGenesis,
          })}
        >
          {formattedGenesis && !isLoading && (
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
              {formattedGenesis}
            </SyntaxHighlighter>
          )}
          {!formattedGenesis && !isLoading && (
            <div className="flex h-screen items-center justify-center text-sm text-brand-gray">In Process...</div>
          )}
          {isLoading && !formattedGenesis && (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenesisFile;
