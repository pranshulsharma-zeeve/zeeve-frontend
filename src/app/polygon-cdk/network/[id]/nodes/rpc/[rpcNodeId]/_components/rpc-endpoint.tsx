"use client";
import React, { useState } from "react";
import { CopyButton, Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { useParams } from "next/navigation";
import { IconEye, IconEyeSlash } from "@zeeve-platform/icons/security/outline";
import KeyValuePair from "@/components/key-value-pair";
import { toShortString } from "@/utils/helpers";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import FlagState from "@/components/flag-state";

const RPCEndpoint = () => {
  const [rpcUsernameVisible, setRpcUsernameVisible] = useState(false);
  const params = useParams();
  const networkId = params.id as string;
  const rpcNodeId = params.rpcNodeId as string;
  const {
    request: { data: nodeInfo, isLoading: isNodeInfoAPILoading },
  } = usePolygonValidiumService().node.rpc.config(networkId, rpcNodeId);

  const {
    request: { data: nodeCreds, isLoading: isNodeCredAPILoading },
  } = usePolygonValidiumService().node.rpc.cred(networkId, rpcNodeId);

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">RPC Endpoint</Heading>
          <div className="flex gap-2">
            <Tooltip text={"Docs to RPC access"} placement="top-start">
              <IconButton
                colorScheme="primary"
                variant={"ghost"}
                onClick={() => {
                  window.open("https://docs.zeeve.io/rollups/polygon-cdk-zkrollups/demo-network/rpc-access");
                }}
              >
                <IconDocument1 className="text-2xl" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label={"HTTPS URL"}
          value={
            typeof nodeInfo?.data?.rpcAccess?.http === "boolean" && nodeInfo.data.endpoint ? (
              nodeInfo?.data.rpcAccess.http ? (
                <Tooltip text={`https://${nodeInfo.data.endpoint}/rpc`} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(`https://${nodeInfo.data.endpoint}/rpc`)}</div>
                    <CopyButton text={`https://${nodeInfo.data.endpoint}/rpc`} />
                  </div>
                </Tooltip>
              ) : (
                <FlagState flag={false} />
              )
            ) : (
              "NA"
            )
          }
          isLoading={isNodeInfoAPILoading}
        />
        <KeyValuePair
          label={"WSS URL"}
          value={
            typeof nodeInfo?.data?.rpcAccess?.ws === "boolean" && nodeInfo.data.endpoint ? (
              nodeInfo.data.rpcAccess.ws ? (
                <Tooltip text={`wss://${nodeInfo.data.endpoint}/ws`} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(`wss://${nodeInfo.data.endpoint}/ws`)}</div>
                    <CopyButton text={`wss://${nodeInfo.data.endpoint}/ws`} />
                  </div>
                </Tooltip>
              ) : (
                <FlagState flag={false} />
              )
            ) : (
              "NA"
            )
          }
          isLoading={isNodeInfoAPILoading}
        />
        <KeyValuePair
          label={"Authentication Type"}
          value={nodeInfo?.data?.rpcAccess?.http || nodeInfo?.data?.rpcAccess?.ws ? "Basic" : "NA"}
          isLoading={isNodeInfoAPILoading || isNodeCredAPILoading}
        />
        <KeyValuePair
          label={"Authentication Username"}
          value={
            nodeCreds?.data?.username ? (
              <div className="flex items-center">
                <span className="mr-2">{rpcUsernameVisible ? nodeCreds.data?.username : "*********"}</span>
                <span
                  className="cursor-pointer text-brand-primary"
                  onClick={() => setRpcUsernameVisible(!rpcUsernameVisible)}
                >
                  {rpcUsernameVisible ? <IconEyeSlash /> : <IconEye />}
                </span>
              </div>
            ) : (
              "NA"
            )
          }
          isLoading={isNodeCredAPILoading}
        />
        <KeyValuePair
          label={"Enabled JSON-RPC API Methods"}
          value={
            nodeInfo?.data?.rpcAccess?.apis && nodeInfo.data.rpcAccess.apis.length > 0 ? (
              <div className="grid grid-cols-12 gap-3 py-1">
                {nodeInfo.data.rpcAccess.apis.map((method: string, index: number) => (
                  <div
                    key={`${method}-${index}`}
                    className="col-span-4 rounded-md border border-brand-green bg-brand-green/10 p-0.5 text-center text-xs xl:col-span-3"
                  >
                    {method}
                  </div>
                ))}
              </div>
            ) : (
              "NA"
            )
          }
          className="col-span-12 lg:col-span-12"
          isLoading={isNodeInfoAPILoading}
        />
      </div>
    </div>
  );
};

export default RPCEndpoint;
