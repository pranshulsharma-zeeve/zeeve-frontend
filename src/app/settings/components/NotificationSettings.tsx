import React from "react";
import { Switch, tx } from "@zeeve-platform/ui";
import type { SettingsNotificationPreferenceKey } from "../hooks/useSettings";

interface NotificationSettingsProps {
  preferences: Record<SettingsNotificationPreferenceKey, boolean>;
  onToggle: (key: SettingsNotificationPreferenceKey) => void;
  className?: string;
  id?: string;
}

const rows: Array<{
  key: SettingsNotificationPreferenceKey;
  title: string;
  description?: string;
}> = [
  {
    key: "marketingUpdates",
    title: "Receive newsletters, promotions and news from Zeeve",
    description: "Stay informed about feature launches, ecosystem initiatives, and platform updates.",
  },
  {
    key: "productUpdates",
    title: "Show notifications each time your edit is exported.",
    description: "Get confirmations whenever configuration changes are deployed.",
  },
];

const NotificationSettings = ({ preferences, onToggle, className, id }: NotificationSettingsProps) => {
  return (
    <section
      id={id}
      className={tx(
        "rounded-[28px] border border-[#E6E9F8] bg-white p-7 shadow-[0_20px_46px_rgba(25,32,58,0.15)]",
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        <p className="text-sm text-slate-500">Choose which product and marketing updates you want to receive.</p>
      </header>

      <div className="space-y-4">
        {rows.map((row) => (
          <label
            key={row.key}
            className="flex flex-col gap-2 rounded-2xl border border-[#E1E4F8] bg-[#F5F7FF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{row.title}</p>
              {row.description ? <p className="text-xs text-slate-500">{row.description}</p> : null}
            </div>
            <Switch
              isChecked={preferences[row.key]}
              onChange={() => onToggle(row.key)}
              aria-label={row.title}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#5141F4] data-[state=checked]:via-[#7B61FF] data-[state=checked]:to-[#14B8FF]"
            />
          </label>
        ))}
      </div>

      <footer className="mt-6 space-y-2 text-xs leading-relaxed text-slate-500">
        <p>
          Zeeve will process your data to send you information about our products and services, promotions, surveys,
          raffles, based on our legitimate interest, and updates, if you have consented to this. Your data will not be
          disclosed to third parties.
        </p>
        <p>
          They will be communicated outside the EU under the terms of the{" "}
          <a
            href="https://www.zeeve.io/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#3B4FE0] underline"
          >
            privacy policy
          </a>
          . You can opt out of our notifications with the first slider.{" "}
          <a
            href="https://www.zeeve.io/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#3B4FE0] underline"
          >
            More information
          </a>
          .
        </p>
      </footer>
    </section>
  );
};

export default NotificationSettings;
