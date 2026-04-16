import { fromBech32 } from "@cosmjs/encoding";
import * as yup from "yup";

function isValidKeplrAddress(address: string, prefix = "testcore") {
  try {
    const { prefix: decodedPrefix } = fromBech32(address);
    return decodedPrefix === prefix;
  } catch (e) {
    return false;
  }
}

export const getSetRewardsValidationSchema = (prefix: string) => {
  return yup.object({
    address: yup
      .string()
      .required("Address is required.")
      .test("is-valid-address", "Invalid address.", function (value) {
        return isValidKeplrAddress(value, prefix);
      }),
    wallet: yup.string().required("Wallet is required.").oneOf(["keplr", "cosmostation", "leap"]),
  });
};
