import * as yup from "yup";

const queryFormValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "First name must contain only alphabets")
    .min(3, "First name must have at least 3 characters")
    .max(20, "First name cannot have more than 20 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Last name must contain only alphabets")
    .min(3, "Last name must have at least 3 characters")
    .max(20, "Last name cannot have more than 20 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  companyName: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .matches(/^[A-Za-z0-9 @._\-!#$%&*]+$/, "Company name must contain allowed characters")
    .min(3, "Company name must have at least 3 characters")
    .max(30, "Company name cannot have more than 30 characters"),
  queryType: yup.string().required("Requires one of the options.").oneOf(["besu", "fabric", "other"]),
  message: yup
    .string()
    .required("Input is required")
    .matches(/^[A-Za-z0-9 @._\-!#$%&*]+$/, "Input must contain allowed characters")
    .min(5, "Input must have at least 5 characters")
    .max(200, "Input cannot have more than 200 characters"),
  condition1: yup.boolean().required().isTrue(),
  condition2: yup.boolean().required().isTrue(),
});

type QueryFormSchemaType = yup.InferType<typeof queryFormValidationSchema>;

export { queryFormValidationSchema };
export type { QueryFormSchemaType };
