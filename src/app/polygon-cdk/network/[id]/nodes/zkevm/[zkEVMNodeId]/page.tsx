import { Metadata } from "next";
import React from "react";
import ZkEVMNodeIdPageClient from "./page-client";

interface Props {
  params: {
    /** network id */
    id: string;
    /** zkEVM node id */
    zkEVMNodeId: string;
  };
}

/** generate dynamic metadata */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { id, zkEVMNodeId },
  } = props;

  return {
    title: "Node",
    description: `Polygon CDK Chain node ${zkEVMNodeId} detail of network ${id}.`,
  };
}

const ZkEVMNodeIdPage = () => {
  return <ZkEVMNodeIdPageClient />;
};

export default ZkEVMNodeIdPage;
