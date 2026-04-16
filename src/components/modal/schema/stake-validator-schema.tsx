import * as yup from "yup";

const stakeValidatorValidationSchema = yup.object({
  validatorName: yup
    .string()
    .matches(
      /^[A-Za-z0-9\s._-]{3,70}$/,
      "Validator name must be 3-70 characters and can contain letters, numbers, spaces, dots, underscores, or hyphens.",
    )
    .required("Validator name is required."),
  description: yup
    .string()
    .matches(/^.{0,280}$/, "Description must be 280 characters or fewer.")
    .optional(),
  delegationAmount: yup
    .number()
    .typeError("Must be a number.")
    .min(20000, "Delegation amount must be at least 20,000.")
    .test("max-decimals", "Maximum 10 decimal places allowed.", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,10})?$/.test(String(value));
    })
    .required("Delegation amount is required."),
  minDelegationAmount: yup
    .number()
    .typeError("Must be a number.")
    .min(20000, "Minimum delegation amount must be at least 20,000.")
    .required("Minimum delegation amount is required.")
    .test("max-decimals", "Maximum 10 decimal places allowed.", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,10})?$/.test(String(value));
    })
    .test(
      "less-than-or-equal-to-delegationAmount",
      "Minimum delegation amount cannot exceed delegation amount.",
      function (value) {
        const { delegationAmount } = this.parent;
        // Only validate if both are numbers
        if (typeof value === "number" && typeof delegationAmount === "number") {
          return value <= delegationAmount;
        }
        return true;
      },
    ),
  commissionRate: yup
    .number()
    .typeError("Must be a number.")
    .min(0, "Commission Rate must be between 0 and 10.")
    .max(10, "Commission Rate must be between 0 and 10.")
    .test("max-decimals", "Maximum 10 decimal places allowed.", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,10})?$/.test(String(value));
    })
    .required("Commission Rate is required."),
  maxCommissionRate: yup
    .number()
    .typeError("Must be a number.")
    .moreThan(0, "Max Commission Rate must be greater than 0.")
    .max(10, "Max Commission Rate must be less than equal to 10.")
    .required("Max Commission Rate is required.")
    .test("max-decimals", "Maximum 10 decimal places allowed.", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,10})?$/.test(String(value));
    })
    .test(
      "greater-than-or-equal-to-commissionRate",
      "Max Commission Rate must be >= Commission Rate.",
      function (value) {
        const { commissionRate } = this.parent;
        // Only validate if both are numbers
        if (typeof value === "number" && typeof commissionRate === "number") {
          return value >= commissionRate;
        }
        return true;
      },
    ),
  maxCommissionChangeRate: yup
    .number()
    .typeError("Must be a number.")
    .min(0, "Max Change Rate must be between 0 and 1.")
    .max(1, "Max Change Rate must be between 0 and 1.")
    .test("max-decimals", "Maximum 10 decimal places allowed.", (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,10})?$/.test(String(value));
    })
    .required("Max Change Rate is required."),
  website: yup.string().optional().max(100, "Maximum 100 characters allowed"),
  enableStateSync: yup.boolean().required().default(true),
});

type StakeValidatorSchemaType = yup.InferType<typeof stakeValidatorValidationSchema>;

export { stakeValidatorValidationSchema };
export type { StakeValidatorSchemaType };
