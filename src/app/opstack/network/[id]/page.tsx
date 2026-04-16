import { Metadata } from "next";
import React from "react";
import IdPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Details",
  description: `OP Stack Details`,
};

const IdPage = () => {
  return <IdPageClient />;
};

export default IdPage;
