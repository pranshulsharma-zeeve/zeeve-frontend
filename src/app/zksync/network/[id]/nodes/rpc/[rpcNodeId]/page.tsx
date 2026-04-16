import { Metadata } from "next";
import React from "react";
import RPCNodeIdPageClient from "./page-client";

interface Props {
  params: {
    /** network id */
    id: string;
    /** RPC node id */
    rpcNodeId: string;
  };
}

/** generate dynamic metadata */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { id, rpcNodeId },
  } = props;

  return {
    title: "Node",
    description: `ZkSync Chain node ${rpcNodeId} detail of network ${id}.`,
  };
}

const RPCNodeIdPage = () => {
  return <RPCNodeIdPageClient />;
};

export default RPCNodeIdPage;
