"use client";
import React, { ComponentPropsWithoutRef, ElementType, ReactElement, useState } from "react";
import Image from "next/image";
import { tx } from "@zeeve-platform/ui";
import { withBasePath } from "@/utils/helpers";

interface CardChart extends ComponentPropsWithoutRef<"div"> {
  Icon?: ElementType;
  title?: string;
  rangeUpdate?: (range: string) => void;
  listGraphType?: (listGraph: boolean) => void;
  action?: ReactElement;
  listGraph?: boolean;
  isTheme?: boolean;
  hideGraphSwitch?: boolean;
  shouldHideDivider?: boolean;
}

const CardChart = (props: CardChart) => {
  const {
    Icon,
    title,
    hideGraphSwitch,
    rangeUpdate,
    action,
    listGraphType,
    listGraph,
    className,
    isTheme,
    children,
    ...rest
  } = props;
  const [dayRange, setDayRange] = useState<string>("1WEEK");
  const updateRange = (range: string) => {
    setDayRange(range);
    if (rangeUpdate) {
      rangeUpdate(range);
    }
  };

  return (
    <div
      className={tx("bg-[#511D7233]/20 text-theme-gray rounded-r-[16px] flex flex-col p-5 gap-5", className)}
      {...rest}
    >
      {title || Icon || action ? (
        <>
          {/* Card Header & Chart Wrapper */}
          <div className="lg:px-0">
            {/* Card Header */}
            <div className="flex flex-row items-center justify-between">
              {/* Icon and Title */}
              <div className="flex flex-row items-center">
                {Icon ? <Icon className="size-auto" /> : null}
                {title && (
                  <p className={`font-poppins text-xl ${!isTheme ? "text-black" : "text-[#FFFFFF]"} lg:text-xl`}>
                    {title}
                  </p>
                )}
              </div>
              {/* <div className="w-fit rounded-lg border border-[#2E3263] bg-[#2E3263] p-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {!hideGraphSwitch &&
                      (listGraph ? (
                        <>
                          <Image
                            src={withBasePath(`/assets/images/graph.svg`)}
                            onError={(e) =>
                              (e.currentTarget.src = withBasePath(
                                "/assets/images/graph.svg",
                              ))
                            }
                            onClick={() =>
                              listGraphType && listGraphType(false)
                            }
                            alt="Graph Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          />
                          <Image
                            src={withBasePath(
                              `/assets/images/list-graph-selected.svg`,
                            )}
                            onError={(e) =>
                              (e.currentTarget.src = withBasePath(
                                "/assets/images/list-graph.svg",
                              ))
                            }
                            onClick={() => listGraphType && listGraphType(true)}
                            alt="List Graph Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          />
                        </>
                      ) : (
                        <>
                          <Image
                            src={withBasePath(
                              `/assets/images/graph-selected.svg`,
                            )}
                            onError={(e) =>
                              (e.currentTarget.src = withBasePath(
                                "/assets/images/graph.svg",
                              ))
                            }
                            onClick={() =>
                              listGraphType && listGraphType(false)
                            }
                            alt="Graph Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          />
                          <Image
                            src={withBasePath(`/assets/images/list-graph.svg`)}
                            onError={(e) =>
                              (e.currentTarget.src = withBasePath(
                                "/assets/images/list-graph.svg",
                              ))
                            }
                            onClick={() => listGraphType && listGraphType(true)}
                            alt="List Graph Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer transition-transform duration-200 hover:scale-110"
                          />
                        </>
                      ))}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </>
      ) : null}
      {children}
    </div>
  );
};

export default CardChart;
