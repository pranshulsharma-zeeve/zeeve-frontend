import { Metadata } from "next";
import React from "react";
import NitroNodeIdPageClient from "./page-client";

interface Props {
  params: {
    /** network id */
    id: string;
    /**Ethereum RPC node id */
    l1RpcNodeId: string;
  };
}

/** generate dynamic metadata */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { id, l1RpcNodeId },
  } = props;

  return {
    title: "Node",
    description: `L1 RPC node ${l1RpcNodeId} detail of network ${id}.`,
  };
}

const L1RpcNodeIdPage = () => {
  return <NitroNodeIdPageClient />;
};

export default L1RpcNodeIdPage;
