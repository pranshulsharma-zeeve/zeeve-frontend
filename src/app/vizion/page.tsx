import { Metadata } from "next";
import React from "react";
import VisionIFrame from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vizion",
    description: `Monitoring & Analytics`,
  };
}

const ManageNodesPage = () => {
  return <VisionIFrame />;
};

export default ManageNodesPage;
