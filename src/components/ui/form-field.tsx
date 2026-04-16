"use client";
import React from "react";
import { FormField as DefaultFormField, FormFieldProps } from "@zeeve-platform/ui-common-components";
import { tx } from "@zeeve-platform/ui";

const FormField = (props: FormFieldProps) => {
  const { label, ...rest } = props;

  return (
    <DefaultFormField
      label={{
        text: label?.text as string,
        isRequired: label?.isRequired,
        tooltip: label?.tooltip,
        className: tx("text-brand-gray font-normal text-xs lg:text-sm", label?.className),
      }}
      {...rest}
    />
  );
};

FormField.displayName = "FormField";

export default FormField;
