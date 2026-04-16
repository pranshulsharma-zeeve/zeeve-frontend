"use client";
import React, { useState } from "react";
import { Button, useToast, Heading, Input, Radio, Checkbox, Link, Label } from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "@zeeve-platform/ui-common-components";
import { QueryFormSchemaType, queryFormValidationSchema } from "../schema/query-form-schema";
import { PlatformServiceError } from "@/services/platform/types";
import usePlatformService from "@/services/platform/use-platform-service";
import { SubmitQueryRequestPayload } from "@/services/platform/protocol/query-form";
import { useConfigStore } from "@/store/config";
import { toCapitalize } from "@/utils/helpers";

interface QueryFormProps {
  protocolName: string;
}

const QueryForm = ({ protocolName }: QueryFormProps) => {
  const [condition1, setCondition1] = useState(false);
  const [condition2, setCondition2] = useState(false);
  const [queryType, setQueryType] = useState(protocolName);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const config = useConfigStore((state) => state.config);

  const { url: submitQueryUrl, request: submitQueryRequest } = usePlatformService().protocol.submitQuery();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<QueryFormSchemaType>({
    resolver: yupResolver(queryFormValidationSchema),
    mode: "all",
  });

  const onSubmit = async (formData: QueryFormSchemaType) => {
    if (!isValid) return;
    try {
      // console.log("inside on submit of query form");
      setIsSubmitting(true);
      const payload: SubmitQueryRequestPayload = {
        name: `${formData?.firstName} ${formData?.lastName}`,
        email: formData?.email,
        company_name: formData?.companyName,
        type: formData?.queryType,
        message: formData?.message,
      };
      const response = await submitQueryRequest(submitQueryUrl, payload);
      if (response && response.data?.success) {
        toast("Your query has been submitted successfully!", {
          status: "success",
        });
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
        toast("Axios Error", {
          status: "error",
          message: err.response?.data?.message,
        });
      } else {
        const err = error as Error;
        toast("An unexpected error occurred", {
          status: "error",
          message: err.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="scrollbar-thin-custom flex h-[83%] w-full flex-col gap-y-8 overflow-y-auto rounded-[10px] bg-white p-6"
    >
      <div className="flex justify-between">
        <FormField className="w-[48%]" helper={{ status: "error", text: errors.firstName?.message?.toString() }}>
          <Label className="text-sm font-medium" isRequired>
            First Name
          </Label>
          <Input
            type="text"
            isRequired
            {...register("firstName")}
            placeholder="First Name"
            className="placeholder:text-sm placeholder:font-normal placeholder:text-[#B4B6B7]"
          />
        </FormField>
        <FormField className="w-[48%]" helper={{ status: "error", text: errors.lastName?.message?.toString() }}>
          <Label className="text-sm font-medium" isRequired>
            Last Name
          </Label>
          <Input
            type="text"
            isRequired
            {...register("lastName")}
            placeholder="Last Name"
            className="placeholder:text-sm placeholder:font-normal placeholder:text-[#B4B6B7]"
          />
        </FormField>
      </div>
      <div className="flex justify-between">
        <FormField className="w-[48%]" helper={{ status: "error", text: errors.email?.message?.toString() }}>
          <Label className="text-sm font-medium" isRequired>
            Email
          </Label>
          <Input
            type="text"
            isRequired
            {...register("email")}
            placeholder="Email Address"
            className="placeholder:text-sm placeholder:font-normal placeholder:text-[#B4B6B7]"
          />
        </FormField>
        <FormField className="w-[48%]" helper={{ status: "error", text: errors.companyName?.message?.toString() }}>
          <Label className="text-sm font-medium">Company Name</Label>
          <Input
            type="text"
            {...register("companyName")}
            placeholder="Company Name"
            className="placeholder:text-sm placeholder:font-normal placeholder:text-[#B4B6B7]"
          />
        </FormField>
      </div>
      <div className="flex justify-between">
        <FormField
          className="flex flex-col justify-between"
          helper={{ status: "error", text: errors.queryType?.message?.toString() }}
        >
          <Heading as="h6" className="font-medium tracking-[0.1px]">
            I want to learn more about:
          </Heading>
          <div className="mt-3 flex gap-x-6">
            <Radio
              {...register("queryType")}
              colorScheme={"primary"}
              size={"small"}
              className=""
              onChange={() => {
                setQueryType(protocolName);
              }}
              value={protocolName}
              isChecked={queryType === protocolName}
            >
              <div className="font-normal text-[#4D4D4E]">{`Hyperledger ${toCapitalize(protocolName)}`}</div>
            </Radio>
            <Radio
              {...register("queryType")}
              colorScheme={"primary"}
              size={"small"}
              className=""
              onChange={() => {
                setQueryType("other");
              }}
              value="other"
              isChecked={queryType === "other"}
            >
              <div className="font-normal text-[#4D4D4E]">{"Other"}</div>
            </Radio>
          </div>
        </FormField>
      </div>

      <FormField className="w-full" helper={{ status: "error", text: errors.message?.message?.toString() }}>
        <Label className="text-sm font-medium" isRequired>
          How can we help?
        </Label>
        <Input
          type="text"
          isRequired
          {...register("message")}
          placeholder="eg. Polygon CDK Demo Network"
          className="h-[70px] placeholder:text-sm placeholder:font-normal placeholder:text-[#B4B6B7]"
        />
      </FormField>
      <div className="flex flex-col gap-y-4">
        <Checkbox
          {...register("condition1")}
          isRequired
          colorScheme={"primary"}
          size={"small"}
          isChecked={condition1}
          className=""
          onClick={() => {
            setCondition1((prev) => !prev);
          }}
        >
          <div className="ml-1 font-normal text-[#4D4D4E]">
            {"I want to receive the Zeeve newsletter and other marketing material from Zeeve."}
          </div>
        </Checkbox>
        <div className="flex items-start gap-x-3">
          <Checkbox
            {...register("condition2")}
            isRequired
            colorScheme={"primary"}
            size={"small"}
            isChecked={condition2}
            className="mt-1"
            onClick={() => {
              setCondition2((prev) => !prev);
            }}
          ></Checkbox>
          <span className="text-sm/[22px] font-normal text-[#4D4D4E]">
            I give consent to process my personal information at Zeeve and agree to Zeeve’s 
            <Link href={config?.other?.termsOfService} className="text-brand-primary underline">
              Terms and Conditions
            </Link>{" "}
            and Zeeve’s 
            <Link href={config?.other?.privacyPolicy} className="text-brand-primary underline">
              Privacy Policy
            </Link>
             where Zeeve may collect, use and disclose personal information.
          </span>
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} isDisabled={false} className="w-full rounded-[4px]">
        Submit
      </Button>
      <span className="text-xs font-normal text-[#4D4D4E]">
        By submitting this form you agree to our{" "}
        <Link href={config?.other?.termsOfService} className="text-brand-primary underline">
          Terms and Conditions
        </Link>{" "}
        which explains how we may collect, use and disclose your personal information.
      </span>
    </form>
  );
};

export default QueryForm;
