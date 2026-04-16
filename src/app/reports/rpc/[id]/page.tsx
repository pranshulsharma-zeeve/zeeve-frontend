import type { Metadata } from "next";
import RPCNodeReportPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RPC Node Report",
    description: "Detailed performance insights for a single RPC node.",
  };
}

const RPCNodeReportPage = () => {
  return <RPCNodeReportPageClient />;
};

export default RPCNodeReportPage;
