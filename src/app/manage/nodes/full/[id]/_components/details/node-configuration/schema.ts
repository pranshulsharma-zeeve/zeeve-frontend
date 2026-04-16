import * as yup from "yup";

const NodeConfigurationValidationSchema = yup
  .object({
    opentelemetry: yup
      .object({
        enable: yup.boolean().required(),
        environment: yup
          .string()
          .nullable()
          .test("is-valid-or-null", "Only alphabets and hyphens are allowed", (value) => {
            // allow null and undefined explicitly
            if (value === null || value === undefined) return true;
            // reject non-string or non-matching values
            return /^[A-Za-z-]+$/.test(value);
          })
          .max(30, "Maximum 30 characters allowed"),
        debug: yup.boolean().required(),
        url_traces: yup
          .string()
          .matches(
            /^https?:\/\/[A-Za-z0-9:/.\-?=]+[A-Za-z0-9]$/,
            "URL must start with http:// or https://, may contain : / . - ? = and must end with a letter or digit",
          )
          .required("url_traces is required")
          .max(150, "Maximum 150 characters allowed"),
        url_logs: yup
          .string()
          .matches(
            /^https?:\/\/[A-Za-z0-9:/.\-?=]+[A-Za-z0-9]$/,
            "URL must start with http:// or https://, may contain : / . - ? = and must end with a letter or digit",
          )
          .required("url_logs is required")
          .max(150, "Maximum 150 characters allowed"),
        headers: yup
          .array()
          .of(yup.mixed()) // accepts any type
          .required("Array is required"),
        batch_traces: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(400, "Must be greater than or equal to 400.")
          .max(10000, "Must be less than or equal to 10000.")
          .required("This field is required."),
        batch_logs: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(400, "Must be greater than or equal to 400.")
          .max(10000, "Must be less than or equal to 10000.")
          .required("This field is required."),
        batch_timeout_ms: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(500, "Must be greater than or equal to 500.")
          .max(10000, "Must be less than or equal to 10000.")
          .required("This field is required."),
        gc_telemetry: yup
          .object({
            enable: yup.boolean().required(),
            min_duration_ms: yup
              .number()
              .typeError("Must be an integer.")
              .integer("Must be an integer.")
              .min(1, "Must be greater than or equal to 1."), // Ensures no decimals
          })
          .required(),
        trace_host_functions: yup.boolean().required(),
        instance_id: yup
          .string()
          .matches(/^[A-Za-z0-9-]+$/, "Only letters, numbers, and hyphens are allowed")
          .required("This field is required")
          .max(30, "Maximum 30 characters allowed"),
      })
      .required(),
    tx_pool: yup
      .object({
        max_size: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(1000, "Must be greater than or equal to 1000.")
          .max(100000, "Must be less than or equal to 100000.")
          .required("This field is required."),
        max_lifespan: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(4, "Must be greater than or equal to 4.")
          .max(100, "Must be less than or equal to 100.")
          .required("This field is required."),
        tx_per_addr_limit: yup
          .string()
          .required("This field is required.")
          .test("is-valid-integer", "Must be an integer between 16 and 10000 inclusive", (val) => {
            if (!val) return false;
            const num = Number(val);
            return Number.isInteger(num) && num >= 16 && num <= 10000;
          }),
      })
      .required(),
    log_filter: yup
      .object({
        max_nb_blocks: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(100, "Must be greater than or equal to 100.")
          .max(3000000, "Must be less than or equal to 3000000.")
          .required("This field is required."),
        max_nb_logs: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(1000, "Must be greater than or equal to 1000.")
          .max(3000000, "Must be less than or equal to 3000000.")
          .required("This field is required."),
        chunk_size: yup
          .number()
          .typeError("Must be an integer.")
          .integer("Must be an integer.") // Ensures no decimals
          .min(1000, "Must be greater than or equal to 1000.")
          .max(3000, "Must be less than or equal to 3000.")
          .required("This field is required."),
      })
      .required(),
    observer: yup
      .object({
        evm_node_endpoint: yup.string().required(),
        rollup_node_tracking: yup.boolean().required(),
      })
      .required(),
    // tx_pool_timeout_limit: yup
    //   .string()
    //   .required("This field is required.")
    //   .test("is-valid-number", "Must be a number between 3600 and 86400 inclusive", (val) => {
    //     if (!val) return false;
    //     const num = Number(val);
    //     return !isNaN(num) && num >= 3600 && num <= 86400;
    //   }),
    // tx_pool_addr_limit: yup
    //   .string()
    //   .required("This field is required.")
    //   .test("is-valid-number", "Must be a number between 4000 and 40000 inclusive", (val) => {
    //     if (!val) return false;
    //     const num = Number(val);
    //     return !isNaN(num) && num >= 4000 && num <= 40000;
    //   }),
    // tx_pool_tx_per_addr_limit: yup
    //   .string()
    //   .required("This field is required.")
    //   .test("is-valid-number", "Must be a number between 16 and 10000 inclusive", (val) => {
    //     if (!val) return false;
    //     const num = Number(val);
    //     return !isNaN(num) && num >= 16 && num <= 10000;
    //   }),
    experimental_features: yup
      .object({
        enable_websocket: yup.boolean().required(),
      })
      .required(),
    finalized_view: yup.boolean().required(),
    kernel_execution: yup
      .object({
        preimages_endpoint: yup.string().required(),
      })
      .required(),
  })
  .required();

type NodeConfigurationSchemaType = yup.InferType<typeof NodeConfigurationValidationSchema>;

export type { NodeConfigurationSchemaType };
export { NodeConfigurationValidationSchema };
