import { AuthenticationType } from "@/types/credentials";

const authenticationMethods: {
  label: string;
  value: AuthenticationType;
}[] = [
  {
    label: "API Key",
    value: "apiKey",
  },
  {
    label: "Basic",
    value: "basic",
  },
];

export { authenticationMethods };
