import { Metadata } from "next";
import React from "react";
import NetworkIdPageClient from "./page-client";

interface Props {
  params: { id: string };
}

/** generate dynamic metadata */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { id },
  } = props;

  return {
    title: "Network",
    description: `ZkSync Chain network ${id} detail.`,
  };
}

const NetworkIdPage = () => {
  return <NetworkIdPageClient />;
};

export default NetworkIdPage;
