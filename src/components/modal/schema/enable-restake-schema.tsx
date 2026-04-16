import * as yup from "yup";

const enableRestakeValidationSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required.")
    .min(1 / 10 ** 6, "Minimum reward can not be less than 0.000001")
    .max(10000, "Minimum reward can not be more than 10000")
    .typeError("amount must be a number"),
  interval: yup
    .number()
    .required("Interval is required.")
    .oneOf([1, 3, 6, 12, 24], "Interval must be one of 1, 3, 6, 12, or 24 hours.")
    .typeError("Interval must be a valid number."),
});

type EnableRestakeSchemaType = yup.InferType<typeof enableRestakeValidationSchema>;

export { enableRestakeValidationSchema };
export type { EnableRestakeSchemaType };
