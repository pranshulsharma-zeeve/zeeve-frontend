import React from "react";
import { Metadata } from "next";
import ValidatorNodeDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Validator Node Detail Page",
};

const ValidatorNodeDetailPage = () => {
  return <ValidatorNodeDetailPageClient />;
};

export default ValidatorNodeDetailPage;
