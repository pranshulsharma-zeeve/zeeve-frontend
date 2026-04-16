import { Metadata } from "next";
import React from "react";
import ArchiveNodesPage from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Archive Nodes",
    description: `Manage Archive Nodes`,
  };
}

const ManageArchiveNodesPage = () => {
  return <ArchiveNodesPage />;
};

export default ManageArchiveNodesPage;
