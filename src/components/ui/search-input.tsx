// search-input.tsx

import React, { ChangeEvent, forwardRef } from "react";
import { IconButton, Input, InputProps, tx } from "@zeeve-platform/ui";
import { IconSearch1 } from "@zeeve-platform/icons/search/outline";
import { IconXMark } from "@zeeve-platform/icons/essential/outline";

interface SearchInputProps extends InputProps {
  searchValue: string;
  onClearButtonClick: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  const { className, onChange, searchValue, onClearButtonClick, ...rest } = props;

  return (
    <Input
      ref={ref}
      value={searchValue}
      onChange={onChange}
      placeholder="Search by address / txn hash / block / token..."
      iconRight={
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <div className="*:text-theme-text *:dark:text-theme-gray mx-4 flex items-center gap-2">
          {searchValue ? (
            <IconButton onClick={onClearButtonClick} variant="text">
              <IconXMark className="text-brand-mainnet" />
            </IconButton>
          ) : null}
          <IconSearch1 />
        </div>
      }
      className={tx(
        {
          "pr-[72px]": searchValue,
        },
        className,
      )}
      {...rest}
    />
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;
