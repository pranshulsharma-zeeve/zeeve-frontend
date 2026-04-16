import type { Metadata } from "next";
import ValidatorFleetReportPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Validator Fleet Report",
    description: "Validator fleet rewards, stake, and risk overview.",
  };
}

const ValidatorFleetReportPage = () => {
  return <ValidatorFleetReportPageClient />;
};

export default ValidatorFleetReportPage;
