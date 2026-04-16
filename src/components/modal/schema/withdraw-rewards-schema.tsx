import * as yup from "yup";

const withdrawRewardsValidationSchema = yup.object({
  // amount: yup.number().required("Amount is required.").min(1).typeError("amount must be a number"),
  wallet: yup.string().required("Wallet is required.").oneOf(["keplr", "cosmostation", "leap"]),
  rewardsOnly: yup.boolean().required(),
});

type WithdrawRewardsSchemaType = yup.InferType<typeof withdrawRewardsValidationSchema>;

export { withdrawRewardsValidationSchema };
export type { WithdrawRewardsSchemaType };
