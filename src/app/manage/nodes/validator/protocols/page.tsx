import { Metadata } from "next";
import React from "react";
import ValidatorNodesSubscriptionsPageClient from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Validator Nodes",
    description: `Manage Validator Nodes`,
  };
}

const ManageValidatorNodesPage = () => {
  return <ValidatorNodesSubscriptionsPageClient />;
};

export default ManageValidatorNodesPage;
