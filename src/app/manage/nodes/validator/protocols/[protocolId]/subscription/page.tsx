import { Metadata } from "next";
import React from "react";
import ProtocolValidatorIdPageClient from "./page-client";

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

const ProtocolValidatorNodeIdPage = () => {
  return <ProtocolValidatorIdPageClient />;
};

export default ProtocolValidatorNodeIdPage;
