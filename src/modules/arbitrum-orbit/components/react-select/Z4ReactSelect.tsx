import React, { MutableRefObject, forwardRef, useEffect, useId, useState } from "react";
import Select, {
  Props,
  MultiValueRemoveProps,
  GroupBase,
  components,
  SelectInstance,
  DropdownIndicatorProps,
  ClearIndicatorProps,
} from "react-select";
import { IconXMark } from "@zeeve-platform/icons/essential/outline";
import { RemoveProperties, tx } from "@zeeve-platform/ui";

const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg width="1em" height="1em" viewBox="0 0 24 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.939453 1.23975L4.46945 4.75975L7.99945 1.23975"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </components.DropdownIndicator>
  );
};

const ClearIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ClearIndicatorProps<Option, IsMulti, Group>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <IconXMark className="rounded-full bg-brand-red/10 p-1 text-xl text-brand-red transition duration-200 ease-in-out hover:bg-brand-red/20" />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <IconXMark className="text-lg text-brand-red transition duration-200 ease-in-out hover:text-brand-red/50" />
    </components.MultiValueRemove>
  );
};

interface Z4ReactSelectProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> extends RemoveProperties<
  Props<Option, IsMulti, Group>,
  "required"
> {
  /** select input size */
  size?: "small" | "medium" | "large";
  /** marks the value-holding input as required for form validation */
  isRequired?: boolean;
}

/**
 * Custom wrapper for `react-select` package.
 * `react-select` is dependent on the browser `window` object to function.
 * The browser’s `window` object is unavailable with `SSR` until a component is fully mounted.
 */
const Z4ReactSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Z4ReactSelectProps<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null,
  ) => {
    Z4ReactSelect.displayName = "Z4ReactSelect";
    const { size = "medium", isRequired, id, instanceId, ...rest } = props;

    const _id = useId();
    const _instanceId = useId();

    // Must be deleted once
    // https://github.com/JedWatson/react-select/issues/5459 is fixed.
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    return isMounted ? (
      <Select
        unstyled
        ref={ref}
        id={id ?? _id}
        instanceId={instanceId ?? _instanceId}
        required={isRequired}
        styles={{
          container: (base) => ({ ...base, fontWeight: "500" }),
          valueContainer: (base) => ({
            ...base,
            overflow: "auto",
            flexWrap: "nowrap",
          }),
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
          multiValueLabel: (base) => ({
            ...base,
            whiteSpace: "normal",
            overflow: "visible",
          }),
          control: (base, state) => ({
            ...base,
            transition: "none",
            ...(state.isDisabled && {
              pointerEvents: "auto",
              cursor: "not-allowed",
            }),
          }),
        }}
        classNames={{
          control: ({ isFocused, isDisabled }) =>
            tx(
              "rounded-lg border border-brand-outline bg-white flex items-center",
              { "h-[50px] max-h-[50px] text-sm placeholder:text-sm": size === "small" },
              { "h-[60px] max-h-[60px] text-base placeholder:text-base": size === "medium" },
              { "h-[70px] max-h-[70px] text-xl placeholder:text-xl": size === "large" },
              { "ring-1 ring-zinc-300": isFocused },
              { "opacity-50": isDisabled },
            ),
          placeholder: () =>
            tx("text-brand-dark/60 px-1", {
              "after:pl-1 after:text-brand-red after:content-['*']": isRequired,
            }),
          input: () => "px-1",
          singleValue: () => "px-1",
          multiValue: () => "bg-gray-100 rounded items-center px-2 gap-1 shrink-0",
          multiValueLabel: () => "leading-6",
          valueContainer: () => "px-3 gap-1 scrollbar-hide",
          indicatorsContainer: () =>
            tx(
              "px-2 gap-1",
              { "h-[50px] max-h-[50px] text-[22px]": size === "small" },
              { "h-[60px] max-h-[60px] text-2xl": size === "medium" },
              { "h-[70px] max-h-[70px] text-3xl": size === "large" },
            ),
          indicatorSeparator: () => "bg-transparent",
          dropdownIndicator: () => "py-0.5 rounded-md",
          menu: () => "px-1 py-1 mt-2 border border-brand-gray/50 shadow rounded-lg bg-white",
          groupHeading: () => "px-3 mt-2 mb-1 font-bold text-brand-gray text-sm",
          option: ({ isFocused, isSelected }) =>
            tx(
              "rounded px-3 py-2 hover:cursor-pointer",
              isFocused && "bg-gray-100 active:bg-gray-200",
              isSelected && "text-brand-gray/70",
            ),
          noOptionsMessage: () => "text-brand-gray p-2 bg-white rounded-sm",
        }}
        components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
        {...rest}
      />
    ) : null;
  },
);

export type { Z4ReactSelectProps };
export { Z4ReactSelect };
