import { Metadata } from "next";
import React from "react";
import ValidatorNodesPage from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Validator Nodes",
    description: `Manage Validator Nodes`,
  };
}

const ManageNodesPage = () => {
  return <ValidatorNodesPage />;
};

export default ManageNodesPage;
