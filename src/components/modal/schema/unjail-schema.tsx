import * as yup from "yup";

const unjailValidationSchema = yup.object({
  wallet: yup.string().required("Wallet is required.").oneOf(["keplr", "cosmostation", "leap"]),
});

type UnjailSchemaType = yup.InferType<typeof unjailValidationSchema>;

export { unjailValidationSchema };
export type { UnjailSchemaType };
