import type { Metadata } from "next";
import InfrastructureHealthReportPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Infrastructure Health Report",
    description: "Comprehensive weekly or monthly overview for your RPC and Validator fleets.",
  };
}

const InfrastructureHealthReportPage = () => {
  return <InfrastructureHealthReportPageClient />;
};

export default InfrastructureHealthReportPage;
