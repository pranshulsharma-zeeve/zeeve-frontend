const REGEX_NAME = /^[A-Za-z]([A-Za-z0-9\s-]){3,18}[A-Za-z0-9]$/;
const REGEX_USERNAME = /^[a-zA-Z0-9]*$/;
const REGEX_MONIKER_ID = /^[a-zA-Z]([a-zA-Z0-9-_]){4,19}$/;
const REGEX_UUID =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const REGEX_RSA_PUBLIC_KEY =
  /(-----BEGIN PUBLIC KEY-----(\n|\r|\r\n)([0-9a-zA-Z\+\/=]{64}(\n|\r|\r\n))*([0-9a-zA-Z\+\/=]{1,63}(\n|\r|\r\n))?-----END PUBLIC KEY-----)|(-----BEGIN PRIVATE KEY-----(\n|\r|\r\n)([0-9a-zA-Z\+\/=]{64}(\n|\r|\r\n))*([0-9a-zA-Z\+\/=]{1,63}(\n|\r|\r\n))?-----END PRIVATE KEY-----)/;

export { REGEX_NAME, REGEX_USERNAME, REGEX_MONIKER_ID, REGEX_UUID, REGEX_PASSWORD, REGEX_RSA_PUBLIC_KEY };
