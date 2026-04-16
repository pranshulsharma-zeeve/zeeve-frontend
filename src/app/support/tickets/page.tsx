import type { Metadata } from "next";
import SupportTicketsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Support Center",
  description: "Manage tickets and reach Zeeve support from one place.",
};

const SupportTicketsPage = () => {
  return <SupportTicketsPageClient />;
};

export default SupportTicketsPage;
