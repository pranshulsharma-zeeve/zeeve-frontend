"use client";
import React from "react";
import SslRpcCard from "./sslRpc";

import { useSslRpcStore } from "@/store/vizion/sslRpc";
import Card from "@/components/vizion/card";

const ServiceSslRpcCard = ({ className }: { className?: string }) => {
  const sslRpc = useSslRpcStore((state) => state.sslRpc);

  // Convert the data object into an array of entries
  const serviceEntries = sslRpc?.data ? Object.entries(sslRpc.data) : [];

  return (
    <Card
      className={`${className} rounded-2xl bg-gradient-to-b from-[#1A2E7E] to-[#181B3E] p-5 font-semibold`}
      title="RPC / SSL Status"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {serviceEntries.map(([serviceName, items]) => {
          // Find relevant items
          const rpcItem = items.find((item) => item.fieldType === "rpc");
          const sslItem = items.find((item) => item.fieldType === "ssl");

          return (
            rpcItem &&
            sslItem && (
              <div key={serviceName} className="w-full">
                <SslRpcCard
                  url={rpcItem.url || ""}
                  title={serviceName} // Use service name as title
                  sslDaysRemaining={Number(sslItem.lastvalue)} // Remaining SSL days
                  rpcStatusCode={rpcItem.status_codes} // RPC status
                />
              </div>
            )
          );
        })}
      </div>
    </Card>
  );
};

export default ServiceSslRpcCard;
