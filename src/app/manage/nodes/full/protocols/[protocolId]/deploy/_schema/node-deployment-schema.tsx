import * as yup from "yup";
import { REGEX_NAME, REGEX_USERNAME } from "@/constants/regex";
import { AuthenticationType } from "@/types/credentials";

const nodeDeploymentValidationSchema = yup.object({
  name: yup
    .string()
    .required("Network name is required.")
    .min(5, "Minimum 5 characters required.")
    .max(20, "Maximum 20 characters allowed.")
    .matches(
      REGEX_NAME,
      "Network name can only contain alphabet, numbers, spaces, and hyphens. Should start with an alphabet and end with an alphabet or a number.",
    ),
  description: yup.string().max(50, "Maximum 50 characters allowed.").optional(),
  workspaceId: yup.object({
    value: yup.string().required("Select a workspace."),
  }),
  regionId: yup.object({
    value: yup.string().required("Select Regions."),
    regionName: yup.string().required("Select Regions Name."),
  }),
  authentication: yup.object({
    https: yup.boolean(),
    ws: yup.boolean(),
    type: yup.object({
      value: yup.mixed<AuthenticationType>().required("Select authentication method."),
    }),
    username: yup.string().when("authentication.type.value", {
      is: "basic",
      then: (schema) =>
        schema
          .required("Username is required.")
          .min(8, "Minimum 8 characters required.")
          .max(20, "Maximum 20 characters allowed.")
          .matches(REGEX_USERNAME, "Username can only contain alphabet and numbers."),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: yup.string().when("authentication.type.value", {
      is: "basic",
      then: (schema) =>
        schema
          .required("Password is required.")
          .min(8, "Minimum 8 characters required.")
          .max(20, "Maximum 20 characters allowed."),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
});

type NodeDeploymentSchemaType = yup.InferType<typeof nodeDeploymentValidationSchema>;

export { nodeDeploymentValidationSchema };
export type { NodeDeploymentSchemaType };
