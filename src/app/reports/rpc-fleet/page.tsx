import type { Metadata } from "next";
import RPCFleetReportPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RPC Fleet Report",
    description: "Aggregated RPC fleet performance and comparison metrics.",
  };
}

const RPCFleetReportPage = () => {
  return <RPCFleetReportPageClient />;
};

export default RPCFleetReportPage;
