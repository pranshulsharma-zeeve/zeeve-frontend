import { Metadata } from "next";
import React from "react";
import FullNodesPage from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RPC Nodes",
    description: `Manage RPC Nodes`,
  };
}

const ManageFullNodesPage = () => {
  return <FullNodesPage />;
};

export default ManageFullNodesPage;
