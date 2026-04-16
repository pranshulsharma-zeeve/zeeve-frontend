"use client";
import { useParams } from "next/navigation";
import { Heading, IconButton, Spinner, Tooltip, tx } from "@zeeve-platform/ui";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as theme from "react-syntax-highlighter/dist/esm/styles/prism";
import { downloadFile } from "@/utils/helpers";
import { BLOCKCHAIN_CONFIG } from "@/types/zksync";

type ZkSyncHyperchainEnvProps = {
  data?: BLOCKCHAIN_CONFIG;
  isLoading: boolean;
};

const ZkSyncHyperchainEnv = ({ data, isLoading }: ZkSyncHyperchainEnvProps) => {
  const { id } = useParams();
  // const [isLoading, setIsLoading] = useState(false);
  const networkId = id as string;
  // const data = {
  //   data: {},
  // };
  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline 2xl:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">zkSync Hyperchain Env</Heading>
          <Tooltip text={"Download Env File"} placement="top-start">
            <IconButton
              colorScheme="primary"
              variant={"ghost"}
              isDisabled={!data?.genesisFile}
              onClick={() => {
                if (data?.genesisFile) {
                  downloadFile(data?.genesisFile, `${networkId}-zksync-hyperchain.env`, "text/plain");
                }
              }}
            >
              <IconDownload className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div
          className={tx("col-span-12 row-span-3 flex max-h-64 flex-col rounded-lg border border-brand-outline", {
            "h-64": !data?.genesisFile,
          })}
        >
          {data?.genesisFile && !isLoading && (
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
              {data?.genesisFile}
            </SyntaxHighlighter>
          )}
          {!data?.genesisFile && !isLoading && (
            <div className="flex h-screen items-center justify-center text-sm text-brand-gray">In Progress...</div>
          )}
          {isLoading && (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZkSyncHyperchainEnv;
