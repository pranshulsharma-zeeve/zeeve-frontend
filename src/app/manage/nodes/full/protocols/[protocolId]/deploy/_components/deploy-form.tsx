import React, { useEffect, useState } from "react";
import { Input, Button, TextArea, Heading, Checkbox, Password, useToast, Card } from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ReactSelect } from "@zeeve-platform/ui-common-components";
import { yupResolver } from "@hookform/resolvers/yup";
import { NodeDeploymentSchemaType, nodeDeploymentValidationSchema } from "../_schema/node-deployment-schema";
import HTTP_STATUS from "@/constants/http";
import { authenticationMethods } from "@/constants/credentials";
import { NodeDeploymentRequestPayload } from "@/services/platform/protocol/deploy";
import { FormField } from "@/components/form-field";
import { OptionType } from "@/types/react-select";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";
import usePlatformService from "@/services/platform/use-platform-service";
import { PlatformServiceError } from "@/services/platform/types";
import ROUTES from "@/routes";

interface FullNodeDeploymentProps {
  data: ProtocolSelectionResponseData;
  regionId: string;
  continentType: string;
  regionName: string;
  networkType: string;
  addOnCodesParam: string;
  isLoading: boolean;
}

const FullNodeDeploymentForm = ({
  data,
  regionId,
  regionName,
  continentType,
  networkType,
  addOnCodesParam,
}: FullNodeDeploymentProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addOnCodes, setAddOnCodes] = useState<{ [key: string]: string[] }>({});
  const path = window.location.pathname;
  const isFullNode = path.includes("full");
  // toast
  const toast = useToast();

  // router
  const router = useRouter();

  useEffect(() => {
    if (addOnCodesParam) {
      try {
        const parsedAddOnCodes = JSON.parse(decodeURIComponent(addOnCodesParam));
        setAddOnCodes(parsedAddOnCodes);
      } catch (error) {
        console.error("Failed to parse addOnCodes:", error);
      }
    }
  }, [addOnCodesParam]);

  // get workspace list
  const {
    request: { isLoading: isWorkspaceListLoading, data: workspaceList },
  } = usePlatformService().workspace.list();

  const workspaceListOptions = workspaceList?.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  // Get the regions based on the selected continent type
  // const selectedRegions = data?.regions[continentType.toLowerCase() as keyof typeof data.regions] || [];

  // Converted to options for a select input
  // const regionListOptions = selectedRegions?.map((region) => ({
  //   label: region.name,
  //   value: region.id,
  // }));

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    unregister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NodeDeploymentSchemaType>({
    resolver: yupResolver(nodeDeploymentValidationSchema),
    mode: "all",
    defaultValues: {
      name: "",
      description: "",
      workspaceId: { value: "" },
      regionId: {
        value: regionId,
        regionName,
      },
      authentication: {
        https: false,
        ws: false,
        type: { value: "apiKey" },
        username: "",
        password: "",
      },
    },
  });

  const watchAuthenticationType = watch("authentication.type.value");

  const { url: createNodeDeploymentUrl, request: createNodeDeploymentRequest } = usePlatformService().protocol.deploy(
    data?.protocolId as string,
  );

  const onSubmit = async (formData: NodeDeploymentSchemaType) => {
    const body: NodeDeploymentRequestPayload = {
      general: {
        name: formData.name,
        description: formData.description,
        workspaceId: formData.workspaceId.value,
        networkType: networkType.toLowerCase(),
        nodeType: isFullNode ? "full" : "validator",
      },
      rpc: {
        authType: formData.authentication.type.value,
        username: formData.authentication.username as string,
        password: formData.authentication.password as string,
        enable: {
          http: formData.authentication.https,
          ws: formData.authentication.ws,
        },
      },
      cloud: {
        cloudId: data?.cloudId,
        regionId,
        regionName,
        credId: "",
        continentName: continentType.toLowerCase(),
      },
      requestAddOns: {
        infraType: addOnCodes.typeOfInfra?.[0] || "",
        nodeType: addOnCodes.nodeType?.[0] || "",
        networkType: addOnCodes.networkType?.[0] || "",
        continentType: addOnCodes.continentType?.[0] || "",
      },
    };
    try {
      setIsSubmitting(true);
      const response = await createNodeDeploymentRequest(createNodeDeploymentUrl, body);
      if (response.status === HTTP_STATUS.OK && response.data) {
        toast("", {
          status: "success",
          message: response?.data?.message,
        });
        router.push(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}`);
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
        toast("", {
          status: "error",
          message: err.response?.data?.message,
        });
      } else {
        toast("An unexpected error occurred", {
          status: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 lg:gap-12">
          <div className="flex flex-col gap-3 lg:gap-6">
            <Heading as="h5">Node General Info</Heading>
            <div className="grid grid-cols-12 items-start gap-3 lg:gap-6">
              <FormField
                className="col-span-12 md:col-span-6 lg:col-span-4"
                helper={{ status: "error", text: errors.name?.message?.toString() }}
              >
                <Heading as="h6" className="font-medium">
                  Name
                </Heading>
                <Input
                  {...register("name")}
                  placeholder="Enter Node Name"
                  floatingLabel={{ labelText: "Enter Node Name" }}
                />
              </FormField>
              <FormField
                className="col-span-12 md:col-span-6 lg:col-span-4"
                helper={{ status: "error", text: errors.description?.message?.toString() }}
              >
                <Heading as="h6" className="font-medium">
                  Description
                </Heading>
                <TextArea
                  {...register("description")}
                  rows={1}
                  placeholder="Enter Node Description"
                  floatingLabel={{ labelText: "Enter Node Description" }}
                />
              </FormField>
              <FormField
                className="col-span-12 md:col-span-6 lg:col-span-4"
                helper={{ status: "error", text: errors.workspaceId?.message?.toString() }}
              >
                <Heading as="h6" className="font-medium">
                  Select Workspace
                </Heading>
                <Controller
                  name="workspaceId"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isRequired
                      {...register("workspaceId")}
                      isLoading={isWorkspaceListLoading}
                      options={workspaceListOptions}
                      placeholder="Select Workspace"
                      onChange={(selectedOption) => {
                        const option = selectedOption as { value: string; label: string };
                        setValue("workspaceId", {
                          value: option.value,
                        });
                      }}
                      value={workspaceListOptions?.find((option) => option.value === field.value?.value)}
                    />
                  )}
                />
              </FormField>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:gap-6">
            <Heading as="h5">Node RPC APIs Endpoint Configuration</Heading>
            <div className="grid grid-cols-12 items-start gap-3 lg:gap-6">
              <FormField className="col-span-12 md:col-span-6 lg:col-span-3">
                <Heading as="h6" className="font-medium">
                  Authentication Type
                </Heading>
                <Controller
                  name="authentication.type.value"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isRequired
                      value={authenticationMethods.find((method) => method.value === field.value)}
                      options={authenticationMethods}
                      placeholder="Select Authentication Type"
                      onChange={(selectedOption) => {
                        const option = selectedOption as OptionType;
                        field.onChange(option.value);
                        if (option?.value === "apiKey") {
                          unregister(["authentication.username", "authentication.password"]);
                        }
                      }}
                    />
                  )}
                />
              </FormField>
              {watchAuthenticationType === "basic" && (
                <>
                  <FormField
                    className="col-span-12 md:col-span-6 lg:col-span-3"
                    helper={{ status: "error", text: errors.authentication?.username?.message?.toString() }}
                  >
                    <Heading as="h6" className="font-medium">
                      RPC Username
                    </Heading>
                    <Input
                      {...register("authentication.username")}
                      placeholder="RPC Username"
                      isRequired
                      floatingLabel={{ labelText: "Enter RPC Username" }}
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-6 lg:col-span-3"
                    helper={{ status: "error", text: errors.authentication?.password?.message?.toString() }}
                  >
                    <Heading as="h6" className="font-medium">
                      RPC Password
                    </Heading>
                    <Password
                      {...register("authentication.password")}
                      shouldToggleMask
                      isRequired
                      placeholder="Password"
                      floatingLabel={{ labelText: "Enter RPC Password" }}
                    />
                  </FormField>
                </>
              )}
              {/* Enable RPC */}
              <div className="col-span-12 flex flex-col gap-3 md:col-span-6 lg:col-span-3 lg:gap-6">
                <Heading as="h5" className="font-medium">
                  Enable RPC{" "}
                </Heading>
                <div className="grid grid-cols-12 gap-3 lg:gap-6 ">
                  <Checkbox
                    {...register("authentication.https", {})}
                    checkboxLabelProps={{
                      className: "text-sm font-poppins col-span-6 lg:col-span-4",
                    }}
                  >
                    HTTPS
                  </Checkbox>
                  <Checkbox
                    {...register("authentication.ws", {})}
                    checkboxLabelProps={{
                      className: "text-sm font-poppins col-span-6 lg:col-span-4",
                    }}
                  >
                    WSS
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col gap-3 lg:gap-6">
            <Heading as="h5">Node Cloud Info</Heading>
            <div className="grid grid-cols-12 items-start gap-3 lg:gap-6">
              <FormField
                className="col-span-12 md:col-span-6 lg:col-span-3"
                helper={{ status: "error", text: errors?.regionId?.value?.message?.toString() }}
              >
                <Heading as="h6" className="font-medium">
                  Select Region
                </Heading>
                <Controller
                  name="regionId"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isRequired
                      isLoading={isLoading}
                      options={regionListOptions}
                      placeholder="Select Region"
                      onChange={(selectedOption) => {
                        const option = selectedOption as { value: string; label: string };
                        setValue("regionId", {
                          value: option.value,
                          regionName: option.label,
                        });
                      }}
                      value={regionListOptions?.find((option) => option.value === field.value?.value)}
                    />
                  )}
                />
              </FormField>
            </div>
          </div> */}
        </div>
        <div className="my-6 flex justify-end">
          <Button type="submit" isLoading={isSubmitting} isDisabled={!isValid}>
            Deploy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FullNodeDeploymentForm;
