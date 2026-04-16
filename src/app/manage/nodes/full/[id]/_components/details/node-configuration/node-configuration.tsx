"use client";
import React, { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Card, Spinner, useToast } from "@zeeve-platform/ui";
import { NodeConfigurationSchemaType, NodeConfigurationValidationSchema } from "./schema";
import OthersAccordion from "./others-accordion";
import LogFilterAccordion from "./log-filter-accordion";
import usePlatformService from "@/services/platform/use-platform-service";
import { useConfigStore } from "@/store/config";
import { UpdateNodeConfigurationsRequestPayload } from "@/services/platform/node-configurations/update-config";
import { AddConfigUpdationLogRequestPayload } from "@/services/platform/node-configurations/add-config-updation-log";
import { useUserStore } from "@/store/user";
import { NodeDetailsResponse } from "@/services/platform/network/node-details";

interface NodeConfigurationProps {
  nodeDetails?: NodeDetailsResponse;
}
// const NodeConfiguration = ({ nodeDetails }: NodeConfigurationProps) => {
//   const [lastSubmittedValues, setLastSubmittedValues] = useState<string | null>(
//     localStorage.getItem("lastSubmittedValues") ?? null,
//   );
//   const [prefilledValues, setPrefilledValues] = useState<NodeConfigurationSchemaType | null>(null);
//   const [isSaving, setIsSaving] = useState(() => localStorage.getItem("isSaving") === "true");
//   const [isEdited, setIsEdited] = useState(false);
//   const config = useConfigStore((state) => state.config);
//   const user = useUserStore((state) => state.user);
//   const toast = useToast();

//   // Extract required keys from the API response for config update
//   const extractRelevantKeys = (values: NodeConfigurationSchemaType) => ({
//     opentelemetry: {
//       enable: values?.opentelemetry?.enable ?? false,
//       environment: values?.opentelemetry?.environment,
//       debug: values?.opentelemetry?.debug,
//       url_traces: values?.opentelemetry?.url_traces,
//       url_logs: values?.opentelemetry?.url_logs,
//       headers: values?.opentelemetry?.headers,
//       batch_traces: values?.opentelemetry?.batch_traces,
//       batch_logs: values?.opentelemetry?.batch_logs,
//       batch_timeout_ms: values?.opentelemetry?.batch_timeout_ms,
//       gc_telemetry: {
//         ...values?.opentelemetry?.gc_telemetry,
//       },
//       trace_host_functions: values?.opentelemetry?.trace_host_functions,
//       instance_id: values?.opentelemetry?.instance_id ?? nodeDetails?.data?.node_name,
//     },
//     tx_pool: {
//       max_size: values?.tx_pool?.max_size,
//       max_lifespan: values?.tx_pool?.max_lifespan,
//       tx_per_addr_limit: values?.tx_pool?.tx_per_addr_limit,
//     },
//     log_filter: {
//       max_nb_blocks: values?.log_filter?.max_nb_blocks,
//       max_nb_logs: values?.log_filter?.max_nb_logs,
//       chunk_size: values?.log_filter?.chunk_size,
//     },
//     // tx_pool_timeout_limit: values?.tx_pool_timeout_limit,
//     // tx_pool_addr_limit: values?.tx_pool_addr_limit,
//     // tx_pool_tx_per_addr_limit: values?.tx_pool_tx_per_addr_limit,
//     finalized_view: values?.finalized_view,
//     experimental_features: {
//       enable_websocket: values?.experimental_features?.enable_websocket ?? true,
//     },
//     observer: {
//       rollup_node_tracking: values?.observer?.rollup_node_tracking,
//       evm_node_endpoint: config?.nodeConfig.evmNodeEndpoint as string,
//     },
//     kernel_execution: {
//       preimages_endpoint: config?.nodeConfig.preimagesEndpoint as string,
//     },
//   });

//   const methods = useForm<NodeConfigurationSchemaType>({
//     resolver: yupResolver(NodeConfigurationValidationSchema),
//     mode: "all",
//   });

//   const {
//     handleSubmit,
//     reset,
//     watch,
//     formState: { isValid },
//   } = methods;

//   const watchedValues = watch();

//   // get node configurations
//   const {
//     request: { data: defaultNodeConfigurationData, isLoading: isDefaultNodeConfigurationLoading },
//   } = usePlatformService().configurations.getNodeConfigurations(
//     nodeDetails?.data?.endpoint,
//     nodeDetails?.data?.api_key,
//     isSaving,
//   );

//   const { url: updateNodeConfigurationsUrl, request: updateNodeConfigurationsRequest } =
//     usePlatformService().configurations.updateNodeConfigurations(nodeDetails?.data?.node_id as string);

//   const { url: addConfigUpdationLogUrl, request: addConfigUpdationLogRequest } =
//     usePlatformService().configurations.addConfigUpdationLog();

//   // set default values in form
//   useEffect(() => {
//     if (!isDefaultNodeConfigurationLoading && defaultNodeConfigurationData) {
//       const extractValuesFromAPI = extractRelevantKeys(defaultNodeConfigurationData);
//       reset(extractValuesFromAPI);
//       setPrefilledValues(extractValuesFromAPI);
//     }
//   }, [reset, isDefaultNodeConfigurationLoading, defaultNodeConfigurationData]);

//   useEffect(() => {
//     // enable edit button only when any of the field values are actually edited to prevent spam with same payload
//     setIsEdited(prefilledValues !== null && JSON.stringify(watchedValues) !== JSON.stringify(prefilledValues));
//     // console.log("watchedValues", JSON.stringify(watchedValues));
//     // console.log("prefilledValues", JSON.stringify(prefilledValues));
//   }, [watchedValues, prefilledValues]);

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null;

//     if (isSaving && lastSubmittedValues) {
//       const startTime = localStorage.getItem("savingStartTime") || Date.now().toString();
//       localStorage.setItem("savingStartTime", startTime);

//       const elapsed = Date.now() - Number(startTime);
//       const remaining = Math.max(480000 - elapsed, 0); // 8 minutes
//       // start timer
//       timeoutId = setTimeout(() => {
//         console.log("Resetting after timeout");
//         setIsSaving(false);
//         setLastSubmittedValues(null);
//         localStorage.removeItem("lastSubmittedValues");
//         localStorage.removeItem("savingStartTime");
//         toast("Failed to update config, please retry.", { status: "error" });
//       }, remaining);
//     }

//     return () => {
//       if (timeoutId) clearTimeout(timeoutId); // cleanup on unmount or deps change
//     };
//   }, [isSaving, lastSubmittedValues]);

//   // Side effect to check if config is succesfully saved on backend and update user accordingly
//   useEffect(() => {
//     const checkConfigUpdation = async () => {
//       console.log("useEffect ran");
//       if (isSaving && lastSubmittedValues && defaultNodeConfigurationData) {
//         const freshValuesFromAPI = extractRelevantKeys(defaultNodeConfigurationData);
//         // compare the form fields deeply
//         const a = JSON.stringify(freshValuesFromAPI);
//         const b = lastSubmittedValues;
//         const areEqual = isEqual(freshValuesFromAPI, JSON.parse(lastSubmittedValues));
//         // const isEqual = JSON.stringify(freshValuesFromAPI) === lastSubmittedValues;

//         // If the incoming response from API is same as the last submitted config, this means our config is succesfully updated on backend
//         if (areEqual) {
//           const payload: AddConfigUpdationLogRequestPayload = {
//             userEmail: user?.usercred || "",
//             updatedAt: new Date().toISOString(),
//             protocolName: nodeDetails?.data?.protocol_name?.toLowerCase() || "",
//             nodeId: nodeDetails?.data?.node_id || "",
//             updatedConfig: JSON.parse(lastSubmittedValues),
//             status: "success",
//           };
//           setIsSaving(false);
//           setLastSubmittedValues(null);
//           localStorage.removeItem("lastSubmittedValues");
//           localStorage.removeItem("savingStartTime");
//           toast("Config updated successfully", {
//             status: "success",
//           });
//           // post request to app-backend for adding new log in database marking successful updation of the config
//           await addConfigUpdationLogRequest(addConfigUpdationLogUrl, payload);
//         } else {
//           console.log("fresh response", a);
//           console.log("last submitted response", b);
//         }
//       }
//     };
//     checkConfigUpdation();
//   }, [isSaving, lastSubmittedValues, defaultNodeConfigurationData]);

//   useEffect(() => {
//     localStorage.setItem("isSaving", String(isSaving));
//     if (isSaving) {
//       // store time when saving begins
//       const startTime = localStorage.getItem("savingStartTime") || Date.now().toString();
//       localStorage.setItem("savingStartTime", startTime);
//     }
//   }, [isSaving]);

//   const onSubmit = async (data: NodeConfigurationSchemaType) => {
//     const isActuallyEdited = prefilledValues && JSON.stringify(data) !== JSON.stringify(prefilledValues);
//     if (!isActuallyEdited) {
//       toast("No new changes to save.", { status: "warning" });
//       return;
//     }

//     setIsSaving(true);
//     setLastSubmittedValues(JSON.stringify(data));
//     localStorage.setItem("lastSubmittedValues", JSON.stringify(data));

//     const payload: UpdateNodeConfigurationsRequestPayload = {
//       client_domain: nodeDetails?.data?.endpoint || "",
//       config: data,
//     };

//     try {
//       await updateNodeConfigurationsRequest(updateNodeConfigurationsUrl, payload);
//     } catch (err) {
//       toast("Failed to update config, please retry.", {
//         status: "error",
//       });
//       console.log(typeof err, err);
//       setIsSaving(false);
//       setLastSubmittedValues(null);
//       localStorage.removeItem("lastSubmittedValues");
//       localStorage.removeItem("savingStartTime");
//     }
//   };

//   return (
//     <FormProvider {...methods}>
//       <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="col-span-10">
//         <div className="flex flex-col gap-2 rounded-2xl border p-3 pb-2 lg:gap-4 lg:p-6 lg:pb-2">
//           <span className="mb-2 text-xl font-medium text-[#09122D]">Node Configurations</span>
//           <LogFilterAccordion />
//           <OthersAccordion prefilledValues={prefilledValues} />
//           {isSaving ? (
//             <Card className="mb-3 flex h-14 w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5">
//               <div className="flex flex-row items-center justify-around gap-3">
//                 <Spinner colorScheme={"cyan"} />
//                 <div className="font-medium text-brand-dark">
//                   {"We're saving your changes. You'll be able to edit again in just a moment."}
//                 </div>
//               </div>
//             </Card>
//           ) : (
//             <Button type="submit" isDisabled={!isValid || !isEdited} className="w-fit self-end">
//               Save
//             </Button>
//           )}
//         </div>
//       </form>
//     </FormProvider>
//   );
// };

// export default NodeConfiguration;

const NodeConfiguration = ({ nodeDetails }: NodeConfigurationProps) => {
  const [lastSubmittedValues, setLastSubmittedValues] = useState<string | null>(
    localStorage.getItem("lastSubmittedValues") ?? null,
  );
  const [prefilledValues, setPrefilledValues] = useState<NodeConfigurationSchemaType | null>(null);
  const [isSaving, setIsSaving] = useState(() => localStorage.getItem("isSaving") === "true");
  const [isEdited, setIsEdited] = useState(false);
  const config = useConfigStore((state) => state.config);
  const user = useUserStore((state) => state.user);
  const toast = useToast();

  // Extract required keys from the API response for config update
  const extractRelevantKeys = useCallback(
    (values: NodeConfigurationSchemaType) => ({
      opentelemetry: {
        enable: values?.opentelemetry?.enable ?? false,
        environment: values?.opentelemetry?.environment,
        debug: values?.opentelemetry?.debug,
        url_traces: values?.opentelemetry?.url_traces,
        url_logs: values?.opentelemetry?.url_logs,
        headers: values?.opentelemetry?.headers,
        batch_traces: values?.opentelemetry?.batch_traces,
        batch_logs: values?.opentelemetry?.batch_logs,
        batch_timeout_ms: values?.opentelemetry?.batch_timeout_ms,
        gc_telemetry: {
          ...values?.opentelemetry?.gc_telemetry,
        },
        trace_host_functions: values?.opentelemetry?.trace_host_functions,
        instance_id: values?.opentelemetry?.instance_id ?? nodeDetails?.data?.node_name,
      },
      tx_pool: {
        max_size: values?.tx_pool?.max_size,
        max_lifespan: values?.tx_pool?.max_lifespan,
        tx_per_addr_limit: values?.tx_pool?.tx_per_addr_limit,
      },
      log_filter: {
        max_nb_blocks: values?.log_filter?.max_nb_blocks,
        max_nb_logs: values?.log_filter?.max_nb_logs,
        chunk_size: values?.log_filter?.chunk_size,
      },
      // tx_pool_timeout_limit: values?.tx_pool_timeout_limit,
      // tx_pool_addr_limit: values?.tx_pool_addr_limit,
      // tx_pool_tx_per_addr_limit: values?.tx_pool_tx_per_addr_limit,
      finalized_view: values?.finalized_view,
      experimental_features: {
        enable_websocket: values?.experimental_features?.enable_websocket ?? true,
      },
      observer: {
        rollup_node_tracking: values?.observer?.rollup_node_tracking,
        evm_node_endpoint: config?.nodeConfig.evmNodeEndpoint as string,
      },
      kernel_execution: {
        preimages_endpoint: config?.nodeConfig.preimagesEndpoint as string,
      },
    }),
    [config?.nodeConfig.evmNodeEndpoint, config?.nodeConfig.preimagesEndpoint, nodeDetails?.data?.node_name],
  );

  const methods = useForm<NodeConfigurationSchemaType>({
    resolver: yupResolver(NodeConfigurationValidationSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = methods;

  const watchedValues = watch();

  // get node configurations
  const {
    request: { data: defaultNodeConfigurationData, isLoading: isDefaultNodeConfigurationLoading },
  } = usePlatformService().configurations.getNodeConfigurations(
    nodeDetails?.data?.endpoint,
    nodeDetails?.data?.api_key,
    isSaving,
  );

  const { url: updateNodeConfigurationsUrl, request: updateNodeConfigurationsRequest } =
    usePlatformService().configurations.updateNodeConfigurations(nodeDetails?.data?.node_id as string);

  const { url: addConfigUpdationLogUrl, request: addConfigUpdationLogRequest } =
    usePlatformService().configurations.addConfigUpdationLog();

  const {
    request: { data: nodeConfigStatusData },
  } = usePlatformService().configurations.getNodeConfigStatus(nodeDetails?.data?.node_id, isSaving);

  // set default values in form
  useEffect(() => {
    if (!isDefaultNodeConfigurationLoading && defaultNodeConfigurationData) {
      const extractValuesFromAPI = extractRelevantKeys(defaultNodeConfigurationData);
      reset(extractValuesFromAPI);
      setPrefilledValues(extractValuesFromAPI);
    }
  }, [extractRelevantKeys, reset, isDefaultNodeConfigurationLoading, defaultNodeConfigurationData]);

  useEffect(() => {
    // enable edit button only when any of the field values are actually edited to prevent spam with same payload
    setIsEdited(prefilledValues !== null && JSON.stringify(watchedValues) !== JSON.stringify(prefilledValues));
    // console.log("watchedValues", JSON.stringify(watchedValues));
    // console.log("prefilledValues", JSON.stringify(prefilledValues));
  }, [watchedValues, prefilledValues]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isSaving && lastSubmittedValues) {
      const startTime = localStorage.getItem("savingStartTime") || Date.now().toString();
      localStorage.setItem("savingStartTime", startTime);

      const elapsed = Date.now() - Number(startTime);
      const remaining = Math.max(480000 - elapsed, 0); // 8 minutes
      // start timer
      timeoutId = setTimeout(() => {
        console.log("Resetting after timeout");
        setIsSaving(false);
        setLastSubmittedValues(null);
        localStorage.removeItem("lastSubmittedValues");
        localStorage.removeItem("savingStartTime");
        toast("Failed to update config, please retry.", { status: "error" });
      }, remaining);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId); // cleanup on unmount or deps change
    };
  }, [isSaving, lastSubmittedValues, toast]);

  // Side effect to check status from backend and update user accordingly
  useEffect(() => {
    const checkConfigUpdation = async () => {
      if (!isSaving || !lastSubmittedValues || !nodeConfigStatusData) {
        return;
      }

      const backendStatus = nodeConfigStatusData?.data?.ansibleServerResponse?.job?.status?.toLowerCase();

      if (nodeConfigStatusData?.success === false || backendStatus === "failed") {
        setIsSaving(false);
        setLastSubmittedValues(null);
        localStorage.removeItem("lastSubmittedValues");
        localStorage.removeItem("savingStartTime");
        toast("Failed to update config, please retry.", { status: "error" });
        return;
      }

      if (backendStatus === "success") {
        const payload: AddConfigUpdationLogRequestPayload = {
          userEmail: user?.usercred || "",
          updatedAt: new Date().toISOString(),
          protocolName: nodeDetails?.data?.protocol_name?.toLowerCase() || "",
          nodeId: nodeDetails?.data?.node_id || "",
          updatedConfig: JSON.parse(lastSubmittedValues),
          status: "success",
        };

        setIsSaving(false);
        setLastSubmittedValues(null);
        localStorage.removeItem("lastSubmittedValues");
        localStorage.removeItem("savingStartTime");
        toast("Config updated successfully", {
          status: "success",
        });
        // post request to app-backend for adding new log in database marking successful updation of the config
        await addConfigUpdationLogRequest(addConfigUpdationLogUrl, payload);
      }
    };

    checkConfigUpdation();
  }, [
    addConfigUpdationLogRequest,
    addConfigUpdationLogUrl,
    isSaving,
    lastSubmittedValues,
    nodeConfigStatusData,
    nodeDetails?.data?.node_id,
    nodeDetails?.data?.protocol_name,
    toast,
    user?.usercred,
  ]);

  useEffect(() => {
    localStorage.setItem("isSaving", String(isSaving));
    if (isSaving) {
      // store time when saving begins
      const startTime = localStorage.getItem("savingStartTime") || Date.now().toString();
      localStorage.setItem("savingStartTime", startTime);
    }
  }, [isSaving]);

  const onSubmit = async (data: NodeConfigurationSchemaType) => {
    const isActuallyEdited = prefilledValues && JSON.stringify(data) !== JSON.stringify(prefilledValues);
    if (!isActuallyEdited) {
      toast("No new changes to save.", { status: "warning" });
      return;
    }

    setIsSaving(true);
    setLastSubmittedValues(JSON.stringify(data));
    localStorage.setItem("lastSubmittedValues", JSON.stringify(data));

    const payload: UpdateNodeConfigurationsRequestPayload = {
      client_domain: nodeDetails?.data?.endpoint || "",
      config: data,
    };

    try {
      const response = await updateNodeConfigurationsRequest(updateNodeConfigurationsUrl, payload);
      const submissionStatus = response?.data?.data?.ansibleServerResponse?.status?.toLowerCase();
      const hasSubmissionError = response?.data?.success === false || submissionStatus !== "accepted";

      if (hasSubmissionError) {
        toast("Failed to update config, please retry.", {
          status: "error",
        });
        setIsSaving(false);
        setLastSubmittedValues(null);
        localStorage.removeItem("lastSubmittedValues");
        localStorage.removeItem("savingStartTime");
      }
    } catch (err) {
      toast("Failed to update config, please retry.", {
        status: "error",
      });
      console.log(typeof err, err);
      setIsSaving(false);
      setLastSubmittedValues(null);
      localStorage.removeItem("lastSubmittedValues");
      localStorage.removeItem("savingStartTime");
    }
  };

  return (
    <FormProvider {...methods}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="col-span-10">
        <div className="flex flex-col gap-2 rounded-2xl border p-3 pb-2 lg:gap-4 lg:p-6 lg:pb-2">
          <span className="mb-2 text-xl font-medium text-[#09122D]">Node Configurations</span>
          <LogFilterAccordion />
          <OthersAccordion prefilledValues={prefilledValues} />
          {isSaving ? (
            <Card className="mb-3 flex h-14 w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5">
              <div className="flex flex-row items-center justify-around gap-3">
                <Spinner colorScheme={"cyan"} />
                <div className="font-medium text-brand-dark">
                  {"We're saving your changes. You'll be able to edit again in just a moment."}
                </div>
              </div>
            </Card>
          ) : (
            <Button type="submit" isDisabled={!isValid || !isEdited} className="w-fit self-end">
              Save
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default NodeConfiguration;
