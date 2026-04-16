const REGEX_ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const REGEX_NUMBER_ONLY = /^[0-9]*$/;
const REGEX_TIME = /^(([1-9][0-9]*d)?([1-5]?[0-9]h)?([1-5]?[0-9]m)?([1-5]?[0-9]s)?([1-9]?[0-9]?[0-9]ms)?)$/;
const REGEX_NAME = /^[A-Za-z]([A-Za-z0-9 ]){2,19}$/;
const REGEX_USERNAME = /^[A-Za-z]([A-Za-z0-9]){7,19}$/;
const REGEX_PASSWORD = /^[A-Za-z0-9]{8,20}$/;

export { REGEX_ETH_ADDRESS, REGEX_NUMBER_ONLY, REGEX_TIME, REGEX_NAME, REGEX_USERNAME, REGEX_PASSWORD };
