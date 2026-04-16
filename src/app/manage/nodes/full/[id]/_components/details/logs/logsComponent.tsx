import {
  Button,
  Card,
  CopyButton,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  Heading,
  IconButton,
  Radio,
  Switch,
  useToggle,
} from "@zeeve-platform/ui";
import React, { Dispatch, SetStateAction, useState } from "react";
import { IconArrow2Down, IconChevronRightCircle } from "@zeeve-platform/icons/arrow/outline";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import Image from "next/image";
import { Tooltip } from "@zeeve-platform/ui";
import { format } from "date-fns";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import NoDataImage from "../../../../../../../../../public/assets/images/logs/no-data.svg";
import TimeRangePicker from "./TimePicker";
import { downloadFile } from "@/utils/helpers";
import IconInfo from "@/components/icons/info";

const formatNanoTimestampToLocal = (nanoTimestampStr: string): string => {
  const milliseconds = Number(nanoTimestampStr) / 1_000_000;
  const date = new Date(milliseconds);
  return format(date, "MMM-dd-yyyy HH:mm:ss");
};

const timeFrames = [
  {
    label: <span className="">5 minutes</span>,
    value: 5,
  },
  {
    label: <div className="">10 minutes</div>,
    value: 10,
  },
  {
    label: <span className="">15 minutes</span>,
    value: 15,
  },
  {
    label: <span className="">30 minutes</span>,
    value: 30,
  },
];

interface LogsComponentProps {
  logs?: string[][];
  isAutoFetching: boolean;
  setIsAutoFetching: Dispatch<SetStateAction<boolean>>;
  selectedTimeFrame: number;
  setSelectedTimeFrame: Dispatch<SetStateAction<number>>;
  selectedService: string | null;
  setSelectedService: Dispatch<SetStateAction<string | null>>;
  services?: string[];
  setQueryParams: Dispatch<SetStateAction<{ endTime: Date; startTime: Date }>>;
  canGoForward: boolean;
  isLoading: boolean;
  isNodeServicesLoading: boolean;
  onNewLogsClick: () => void;
  onOldLogsClick: () => void;
}

const LogsComponent = ({
  logs,
  isAutoFetching,
  setIsAutoFetching,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedService,
  setSelectedService,
  services,
  setQueryParams,
  canGoForward,
  isLoading,
  isNodeServicesLoading,
  onNewLogsClick,
  onOldLogsClick,
}: LogsComponentProps) => {
  const { isOpen: isDropdownOpen, handleToggle, handleClose } = useToggle();
  const {
    isOpen: isServicesDropdownOpen,
    handleToggle: handleServicesToggle,
    handleClose: handleServicesClose,
  } = useToggle();
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const renderTimeFramesDropDown = () => (
    <DropdownMenu onClose={handleClose} isOpen={isDropdownOpen}>
      <DropdownMenuButton
        as={Button}
        size={"small"}
        isDisabled={isLoading || isNodeServicesLoading}
        onClick={handleToggle}
        isFullWidth
        className="mt-14 h-[40px] w-auto justify-between rounded-lg border border-brand-primary bg-transparent text-sm font-medium text-brand-primary md:mt-0 lg:text-base"
      >
        <span className="flex items-center gap-2">
          {timeFrames.find((time) => time.value === selectedTimeFrame)?.label}
          <IconArrow2Down className="size-5" />
        </span>
      </DropdownMenuButton>
      <DropdownMenuList className="w-[200px] rounded-xl border-none p-0">
        {timeFrames.map(({ label, value }, index) => {
          return (
            <DropdownMenuItem
              key={index}
              className={`m-auto rounded-none border-t hover:border-t ${index === 0 ? "rounded-t-xl border-0" : ""} ${index === timeFrames.length - 1 ? "rounded-b-xl" : ""} border-brand-outline px-2 py-6`}
            >
              <Radio
                colorScheme={"primary"}
                isChecked={selectedTimeFrame === value}
                readOnly
                className=""
                onClick={() => {
                  setSelectedTimeFrame(value);
                }}
              >
                <div className="ml-2">{label}</div>
              </Radio>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuList>
    </DropdownMenu>
  );

  const rendeServicesDropdown = () => (
    <DropdownMenu onClose={handleServicesClose} isOpen={isServicesDropdownOpen}>
      <DropdownMenuButton
        as={Button}
        size={"small"}
        isDisabled={isNodeServicesLoading || !services?.length}
        onClick={handleServicesToggle}
        isFullWidth
        className="h-8 w-auto justify-between rounded-lg border border-brand-primary bg-transparent text-sm font-medium text-brand-primary lg:text-base"
      >
        <span className="flex items-center gap-2">
          {selectedService ?? "Select Service"}
          <IconArrow2Down className="size-5" />
        </span>
      </DropdownMenuButton>
      <DropdownMenuList className="w-fit rounded-xl border-none p-0">
        {services?.map((service, index) => {
          return (
            <DropdownMenuItem
              key={index}
              className={`m-auto rounded-none border-t hover:border-t ${index === 0 ? "rounded-t-xl border-0" : ""} ${index === services.length - 1 ? "rounded-b-xl" : ""} border-brand-outline px-2 py-6 hover:bg-brand-primary/80`}
            >
              <Radio
                colorScheme={"primary"}
                isChecked={selectedService === service}
                readOnly
                className=""
                onClick={() => {
                  setSelectedService(service);
                }}
              >
                <div className="ml-2">{service}</div>
              </Radio>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuList>
    </DropdownMenu>
  );

  const renderActionButtons = () => (
    <div className="flex items-center gap-3">
      {/** Copy Button */}
      <IconButton
        className="size-7 rounded-[4px] border border-brand-gray bg-white lg:size-8"
        isDisabled={!logs?.length}
      >
        <CopyButton
          text={logs?.toString() ?? ""}
          className="text-sm text-brand-gray lg:text-base"
          isDisabled={!logs?.length}
        />
      </IconButton>
      {/** Download Button */}
      <Tooltip text="Download" placement="bottom-start">
        <IconButton
          className="size-7 rounded-[4px] border border-brand-gray bg-white lg:size-8"
          isDisabled={!logs?.length}
          onClick={() => {
            if (logs) {
              downloadFile(logs.toString(), "logs.txt", "text/plain");
            }
          }}
        >
          <IconDownload className="text-sm text-brand-gray lg:text-base" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <div>
      <Heading as="h3" className="flex items-center justify-between text-lg font-medium text-[#09122D] lg:text-2xl">
        Logs
        <Tooltip
          text="Can only fetch maximum 3000 logs at a time. If you feel there is still data after a specific time period then try to reduce the time period, and query in small chunks."
          placement="right"
          className="ml-1 w-64"
        >
          <span className="ml-2 mr-auto mt-1">
            <IconInfoCircle className="size-4 text-gray-600" />
          </span>
        </Tooltip>
        <Switch isChecked={isAutoFetching} className="mr-auto" onChange={() => setIsAutoFetching((prev) => !prev)}>
          <span className="text-xs text-brand-gray md:text-sm">Auto refresh latest logs</span>
        </Switch>
      </Heading>
      <Card className="rounded-lg border-none bg-transparent p-0 lg:gap-5 lg:p-0 lg:pt-7">
        <div className="flex justify-between">
          {/* <div className="flex items-center gap-1">
              <IconInfo width={20} height={20} />
              <span className="text-sm">Timestamps are in UTC.</span>
            </div> */}
          {rendeServicesDropdown()}
          {renderActionButtons()}
        </div>
        {/** Logs panel */}
        <div className="rounded-md bg-black p-0 text-left text-white">
          <div className="flex h-[26px] bg-white/30">
            <span className="ml-3 mt-[2px]">
              {">_ "}&nbsp;&nbsp;{`${selectedService ?? ""} logs`}
            </span>
          </div>
          {/** Custom Loader */}
          {isLoading && (
            <div className="flex h-[500px] flex-col justify-center">
              <div className="mx-auto size-28 animate-spin rounded-full border-8 border-white border-t-transparent"></div>
            </div>
          )}
          {!isLoading && !logs?.length && (
            <div className="flex h-[500px] w-full flex-col items-center justify-center gap-3 text-lg">
              <Image src={NoDataImage} alt="no-data-image" />
              No Logs Found.
            </div>
          )}
          {!isLoading && logs?.length && (
            <div className="scrollbar-thin-custom h-[500px] w-full overflow-y-auto p-6">
              {logs.map((log, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md font-mono text-sm font-medium text-brand-light hover:bg-white/15 lg:text-base"
                  >
                    <div className="flex gap-x-3">
                      <span className="min-w-fit text-slate-500">{`[${formatNanoTimestampToLocal(log[0])}]`}</span>
                      <span className="min-w-fit text-slate-500">{`[${log[1].slice(0, 19)}]`}</span>
                      <span className="">{log[1].slice(19)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
      <div className="mt-6 flex justify-end gap-3">
        {/** Custom Time Picker */}
        <div className="absolute left-4 h-11 md:left-12">
          <Button
            onClick={() => setShowTimePicker((prev) => !prev)}
            variant={"outline"}
            iconRight={<IconChevronRightCircle className="ml-1 text-[20px] text-brand-primary" />}
            className="text-sm text-brand-primary lg:text-base"
            isDisabled={isLoading || isNodeServicesLoading}
          >
            Select Time Range
          </Button>
          {showTimePicker && <TimeRangePicker setShowTimePicker={setShowTimePicker} setQueryParams={setQueryParams} />}
        </div>
        <Button
          onClick={onOldLogsClick}
          variant={"outline"}
          // iconLeft={<IconChevronLeftCircle className="text-[20px] text-brand-primary" />}
          className="mt-14 p-2 md:mt-0"
          isDisabled={isLoading || isNodeServicesLoading}
        >
          {"<<"}
        </Button>
        {/** Timeframes Dropdown */}
        {renderTimeFramesDropDown()}
        <Button
          onClick={onNewLogsClick}
          variant={"outline"}
          // iconRight={<IconChevronRightCircle className="text-[20px] text-brand-primary" />}
          className="mt-14 p-2 md:mt-0"
          isDisabled={isLoading || isNodeServicesLoading || !canGoForward}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
};

export default LogsComponent;
