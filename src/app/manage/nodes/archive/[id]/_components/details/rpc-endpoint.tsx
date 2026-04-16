"use client";
import React from "react";
import { CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import KeyValuePair from "@/components/key-value-pair";
import { toShortString } from "@/utils/helpers";
import { NetworkDetailsResponse } from "@/services/platform/protocol/details";
import FlagState from "@/components/flag-state";

interface GeneralInfoProps {
  data: NetworkDetailsResponse;
  isLoading: boolean;
}

const getEndpointUrl = (endpoint: string, apiKey: string, type: "https" | "wss", authType: string) => {
  const protocol = type === "https" ? "https" : "wss";
  const protocolType = type === "https" ? "rpc" : "ws";
  return authType === "apiKey"
    ? `${protocol}://${endpoint}/${apiKey}/${protocolType}`
    : `${protocol}://${endpoint}/${protocolType}`;
};
const RPCEndpoint = ({ data, isLoading }: GeneralInfoProps) => {
  const endpoint = data?.nodes[0]?.metaData?.nodes[0]?.endpoint;
  const rpc = data?.nodes[0]?.metaData?.rpc;
  const apiKey = data?.nodes[0]?.metaData?.rpc?.apiKey as string;
  const authType = rpc?.authType;

  const httpsUrl = endpoint ? getEndpointUrl(endpoint, apiKey, "https", authType) : "NA";
  const wssUrl = endpoint ? getEndpointUrl(endpoint, apiKey, "wss", authType) : "NA";

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">RPC APIs Endpoint</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label={"HTTPS URL"}
          value={
            data?.network?.status !== "ready" ? (
              "NA"
            ) : typeof rpc?.enable?.http === "boolean" && endpoint ? (
              rpc.enable.http ? (
                <Tooltip text={httpsUrl} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(httpsUrl)}</div>
                    <CopyButton text={httpsUrl} />
                  </div>
                </Tooltip>
              ) : (
                <FlagState flag={false} />
              )
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
        />
        <KeyValuePair
          label={"WSS URL"}
          value={
            data?.network?.status !== "ready" ? (
              "NA"
            ) : typeof rpc?.enable?.ws === "boolean" && endpoint ? (
              rpc.enable.ws ? (
                <Tooltip text={wssUrl} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(wssUrl)}</div>
                    <CopyButton text={wssUrl} />
                  </div>
                </Tooltip>
              ) : (
                <FlagState flag={false} />
              )
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
        />
        <KeyValuePair
          label={"Authentication Type"}
          value={authType === "apiKey" ? "API KEY" : authType === "basic" ? "Basic" : "NA"}
          isLoading={isLoading}
        />
        {authType !== "apiKey" && (
          <KeyValuePair
            label={"Authentication User"}
            value={rpc?.username || "NA"}
            isLoading={isLoading}
            className="lg:col-span-6"
          />
        )}

        {/* <KeyValuePair
          label={"Enabled JSON-RPC API Methods"}
          value={
            rpc?.jsonRpcApiMethods && rpc.jsonRpcApiMethods.length > 0 ? (
              <div className="grid grid-cols-12 gap-3 py-1">
                {rpc?.jsonRpcApiMethods.map((method, index) => (
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
          isLoading={isLoading}
        /> */}
      </div>
    </div>
  );
};

export default RPCEndpoint;
