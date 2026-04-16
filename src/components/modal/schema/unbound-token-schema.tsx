import * as yup from "yup";

export const getValidationSchema = (maxAmount: number) => {
  return yup.object({
    amount: yup
      .number()
      .required("Amount is required.")
      .min(1 / 10 ** 6, "Amount can not be less than 0.000001")
      .max(maxAmount, `Amount can not be more than ${maxAmount}`)
      .typeError("amount must be a number"),
    wallet: yup.string().required("Wallet is required.").oneOf(["keplr", "cosmostation", "leap"]),
  });
};
