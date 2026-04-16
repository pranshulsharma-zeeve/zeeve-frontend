"use client";
import React from "react";
import { Heading, Tooltip, Z4CopyButton } from "@zeeve-platform/ui";
import KeyValuePair from "@orbit/components/key-value-pair";
import { toShortString } from "@orbit/utils/helpers";
import FlagState from "@orbit/components/flag-state";
import { NodeDetail } from "@orbit/types/node";

type RPCEndpointProps = {
  data?: NodeDetail | undefined;
  isLoading: boolean;
};

const RPCEndpoint = ({ data, isLoading }: RPCEndpointProps) => {
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">RPC Endpoint</Heading>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label={"HTTPS URL"}
          value={
            typeof data?.nodeEndpointConfig?.http === "boolean" && data?.nodeEndpointConfig?.endpoint ? (
              data?.nodeEndpointConfig?.http ? (
                <Tooltip text={`https://${data?.nodeEndpointConfig?.endpoint}/rpc`} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(`https://${data?.nodeEndpointConfig?.endpoint}/rpc`)}</div>
                    <Z4CopyButton text={`https://${data?.nodeEndpointConfig?.endpoint}/rpc`} />
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
            typeof data?.nodeEndpointConfig?.ws === "boolean" && data?.nodeEndpointConfig?.endpoint ? (
              data?.nodeEndpointConfig?.ws ? (
                <Tooltip text={`wss://${data?.nodeEndpointConfig?.endpoint}/ws`} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(`wss://${data?.nodeEndpointConfig?.endpoint}/ws`)}</div>
                    <Z4CopyButton text={`wss://${data?.nodeEndpointConfig?.endpoint}/ws`} />
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
          value={
            data?.nodeEndpointConfig?.credentials.type === "api_key"
              ? "API KEY"
              : data?.nodeEndpointConfig?.credentials.type === "basic_auth"
                ? "Basic"
                : "NA"
          }
          isLoading={isLoading}
        />
        <KeyValuePair
          label={"Enabled JSON-RPC API Methods"}
          value={
            data?.nodeEndpointConfig?.jsonRpcApiMethods && data?.nodeEndpointConfig?.jsonRpcApiMethods.length > 0 ? (
              <div className="grid grid-cols-12 gap-3 py-1">
                {data?.nodeEndpointConfig?.jsonRpcApiMethods.map((method, index) => (
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
        />
      </div>
    </div>
  );
};

export default RPCEndpoint;
