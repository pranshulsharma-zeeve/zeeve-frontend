import React from "react";
import { Metadata } from "next";
import ListPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Arbitrum Orbit",
  description: "Arbitrum Orbit Network List.",
};

const ListPage = () => {
  return <ListPageClient />;
};

export default ListPage;
