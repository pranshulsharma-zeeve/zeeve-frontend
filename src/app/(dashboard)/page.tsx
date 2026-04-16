import { Metadata } from "next";
import React from "react";
import DashboardPageClient from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard",
    description: `Platform Dashboard`,
  };
}

const DashboardPage = () => {
  return <DashboardPageClient />;
};

export default DashboardPage;
