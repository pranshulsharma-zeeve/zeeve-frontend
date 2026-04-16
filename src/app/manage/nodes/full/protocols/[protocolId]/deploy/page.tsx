import { Metadata } from "next";
import React from "react";
import ProtocolDeployPageClient from "./page-client";

interface Props {
  params: { protocolId: string };
}

/** generate dynamic metadata */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { protocolId },
  } = props;

  return {
    title: protocolId,
  };
}

const ProtocolFullNodeIdPage = () => {
  return <ProtocolDeployPageClient />;
};

export default ProtocolFullNodeIdPage;
