"use client";
import React, { ComponentPropsWithoutRef, ElementType, ReactElement } from "react";
import { tx } from "@zeeve-platform/ui";
import ListHeaderFilter from "./filter";

interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  Icon?: ElementType;
  title?: string | ReactElement;
  action?: ReactElement;
  shouldHideDivider?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData?: (filter: string) => void;
  nextData?: (range: number) => void;
  refreshData?: () => void;
  isTheme?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  isLoading?: boolean;
  setPageNumber?: (page: number) => void; // Accept page setter
  pageNumber?: number; // Accept current page
}

const CardTable = (props: CardProps) => {
  const { Icon, title, isTheme, action, className, children, updateData, ...rest } = props;

  return (
    <div
      className={tx(className, "bg-theme-primary text-theme-gray rounded-[10px] p-3 lg:p-5 flex flex-col")}
      {...rest}
    >
      <div className="mb-3 flex flex-row items-center justify-between lg:mb-5">
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex flex-row items-center gap-2">
            {Icon && <Icon className="size-auto" />}
            {title && (
              <p className={`font-poppins text-xl ${!isTheme ? "text-[#09122D]" : "text-[#FFFFFF]"} lg:text-xl`}>
                {title}
              </p>
            )}
          </div>
          <div className={` text-xs font-normal  ${!isTheme ? "text-[#09122D]" : "text-[#FFFFFF]"}`}>
            Please note: The data below is for informational purposes only, and no action is required.
          </div>
        </div>
        {(title || Icon || action) && (
          <div className="flex flex-row items-center justify-between gap-3">
            <div>
              <ListHeaderFilter
                items={[
                  {
                    title: "All",
                    onClick: () => updateData && updateData("0"),
                    colour: "",
                  },
                  {
                    title: "Info",
                    onClick: () => updateData && updateData("1"),
                    colour: "#2D9CDB",
                  },
                  {
                    title: "Warning",
                    onClick: () => updateData && updateData("2"),
                    colour: "#CEB940",
                  },
                  {
                    title: "Average",
                    onClick: () => updateData && updateData("3"),
                    colour: "#607FFF",
                  },
                  {
                    title: "High",
                    onClick: () => updateData && updateData("4"),
                    colour: "#BD6E20",
                  },
                  {
                    title: "Disaster",
                    onClick: () => updateData && updateData("5"),
                    colour: "#DE4841",
                  },
                  {
                    title: "Normal",
                    onClick: () => updateData && updateData("6"),
                    colour: "#6C757D",
                  },
                ]}
              />
            </div>

            {action}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default CardTable;
