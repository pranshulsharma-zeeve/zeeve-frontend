import React, { useState } from "react";
import { DropdownMenu, DropdownMenuButton, DropdownMenuList, useToggle } from "@zeeve-platform/ui";
import Image from "next/image";
import { SecondaryOutlinedButton } from "@/components/vizion/button";
import EWXDropdownMenuItem from "@/components/vizion/dropdown-menu-item";
import { withBasePath } from "@/utils/helpers";

interface ListHeaderFilterProps {
  filterText?: string;
  items: {
    title: string;
    onClick?: () => void;
    selected?: boolean;
    colour: string;
  }[];
}

const ListHeaderFilter = (props: ListHeaderFilterProps) => {
  const { items, filterText } = props;
  const [selectedItem, setSelectedItem] = useState<string>("All");
  const { isOpen, handleToggle, handleClose } = useToggle();

  const handleItemClick = (title: string) => {
    setSelectedItem(title);
    const item = items.find((i) => i.title === title);
    if (item && item.onClick) item.onClick();
  };

  return (
    <DropdownMenu isOpen={isOpen} onClose={handleClose}>
      <DropdownMenuButton
        as={SecondaryOutlinedButton}
        iconRight={
          <Image
            src={withBasePath(`/assets/images/filter-icon.svg`)}
            onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/vizion/filter-icon.svg"))}
            alt="Filter"
            width={24}
            height={24}
            className="border-none"
          />
        }
        onClick={handleToggle}
        className="border-none bg-transparent p-2 shadow-none"
      ></DropdownMenuButton>

      <DropdownMenuList className={`m-0 border py-0 text-black`}>
        {items.length
          ? items.map((item, index) => {
              return (
                <EWXDropdownMenuItem
                  className={`w-full py-6 text-sm font-normal ${index > 0 ? "border-t border-[#E1E1E1]" : ""} ${
                    selectedItem === item.title
                      ? "bg-[#CED7FF] text-black"
                      : "bg-white text-[#09122D] hover:bg-[#CED7FF] hover:text-black"
                  } ${
                    index === 0 ? "rounded-t-lg" : "" // First item rounded top
                  } ${index === items.length - 1 ? "rounded-b-lg" : ""}`} // Last item rounded bottom
                  key={index}
                  onClick={() => handleItemClick(item.title)}
                  selected={selectedItem === item.title}
                  style={{ color: item.colour }}
                >
                  {item.title}
                </EWXDropdownMenuItem>
              );
            })
          : null}
      </DropdownMenuList>
    </DropdownMenu>
  );
};

export type { ListHeaderFilterProps };
export default ListHeaderFilter;
