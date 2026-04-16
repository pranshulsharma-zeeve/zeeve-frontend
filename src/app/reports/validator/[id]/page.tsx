import type { Metadata } from "next";
import ValidatorNodeReportPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Validator Report",
    description: "Detailed validator performance, rewards, and delegator analytics.",
  };
}

const ValidatorNodeReportPage = () => {
  return <ValidatorNodeReportPageClient />;
};

export default ValidatorNodeReportPage;
