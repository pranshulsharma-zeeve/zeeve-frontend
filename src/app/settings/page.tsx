import { Metadata } from "next";
import React from "react";
import SettingsPage from "./SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile, passwords, notifications, and subscriptions.",
};

const Settings = () => {
  return <SettingsPage />;
};

export default Settings;
