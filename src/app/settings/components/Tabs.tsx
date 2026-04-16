import React from "react";
import { tx } from "@zeeve-platform/ui";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

const Tabs = ({ items, activeId, onChange, className }: TabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className={tx("flex flex-wrap items-center gap-6 text-sm font-medium text-[#4B5563]", className)}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        const iconNode = item.icon
          ? React.cloneElement(item.icon, {
              className: tx(
                "h-[18px] w-[18px] transition-colors",
                item.icon.props.className,
                isActive ? "text-[#4054B2]" : "text-[#A0A0A0]",
              ),
            })
          : null;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={tx(
              "relative py-2 transition focus-visible:outline-none focus-visible:ring-0",
              isActive ? "text-brand-primary" : "text-[#4B5563] hover:text-brand-primary",
            )}
            onClick={() => onChange(item.id)}
          >
            <span className="inline-flex items-center gap-2">
              {iconNode}
              <span>{item.label}</span>
            </span>
            {isActive ? (
              <span className="absolute inset-x-0 bottom-[-12px] h-[4px] rounded-full bg-gradient-to-r from-brand-primary to-brand-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export type { TabItem };
export default Tabs;
