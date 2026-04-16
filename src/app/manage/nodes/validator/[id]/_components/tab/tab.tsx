"use client";
import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Tooltip } from "@zeeve-platform/ui";

type Tab = {
  label: string;
  content: ReactNode;
  disabled?: boolean;
  disabledTooltip?: string;
};

interface BasicTabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  className?: string;
}

const BasicTabs: React.FC<BasicTabsProps> = ({ tabs, defaultIndex = 0, className }) => {
  const getInitialActiveIndex = () => {
    if (!tabs.length) {
      return 0;
    }
    const normalizedDefault = Math.min(Math.max(defaultIndex, 0), tabs.length - 1);
    if (!tabs[normalizedDefault]?.disabled) {
      return normalizedDefault;
    }
    const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
    return firstEnabled >= 0 ? firstEnabled : normalizedDefault;
  };
  const [activeIndex, setActiveIndex] = useState(getInitialActiveIndex);

  useEffect(() => {
    if (!tabs.length) {
      return;
    }
    if (activeIndex >= tabs.length || tabs[activeIndex]?.disabled) {
      const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
      if (firstEnabled >= 0 && firstEnabled !== activeIndex) {
        setActiveIndex(firstEnabled);
        return;
      }
      if (activeIndex >= tabs.length) {
        setActiveIndex(Math.max(0, tabs.length - 1));
      }
    }
  }, [tabs, activeIndex]);

  const activeTab = tabs[activeIndex] ?? tabs.find((tab) => !tab.disabled);
  if (!activeTab) {
    return null;
  }
  return (
    <div className={clsx("w-full", className)}>
      {/* Tabs Header */}
      <div className="mb-4 flex border-b border-gray-200">
        {tabs.map((tab, index) =>
          tab.disabled && tab.disabledTooltip ? (
            <Tooltip key={tab.label} text={tab.disabledTooltip} placement="top" className="rounded-lg">
              <span>
                <button
                  type="button"
                  disabled
                  className={clsx(
                    "cursor-not-allowed border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-400 transition-colors duration-200",
                  )}
                >
                  {tab.label}
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              key={tab.label}
              type="button"
              disabled={tab.disabled}
              onClick={() => {
                if (tab.disabled) return;
                setActiveIndex(index);
              }}
              className={clsx(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-200",
                tab.disabled
                  ? "cursor-not-allowed border-transparent text-gray-400"
                  : activeIndex === index
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-gray-500 hover:text-brand-dark",
              )}
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      {/* Tabs Content */}
      <div className="mt-2">{activeTab.content}</div>
    </div>
  );
};

export default BasicTabs;
