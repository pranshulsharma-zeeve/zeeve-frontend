import * as yup from "yup";

const purchaseFormValidationSchema = yup
  .object({
    node: yup
      .object({
        count: yup
          .number()
          .typeError("This field is required.")
          .required("This field is required.")
          .min(1, "Minimum value is 1")
          .max(100, "Maximum value is 100"),
      })
      .required("Node count is required."),
    cloud: yup.string().required("Please select the Cloud Type."),
    nodeType: yup.string().required("Please select the Node Type."),
    networkType: yup.string().required("Please select the Network Type."),
    // region: yup
    //   .object({
    //     id: yup.string().required("Please select the Region."),
    //     name: yup.string().optional(), // `region.name` is optional
    //   })
    //   .required("Region is required."),
    continent: yup.string().required("Continent Type is required."),
  })
  .required();

type PurchaseFormSchemaType = yup.InferType<typeof purchaseFormValidationSchema>;

export { purchaseFormValidationSchema };
export type { PurchaseFormSchemaType };
