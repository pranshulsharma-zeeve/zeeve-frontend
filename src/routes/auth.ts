import { withApiBasePath } from "@/constants/api";

const AUTH_BASE_PATH = "/account";
const withAuthBase = (path: string) => `${AUTH_BASE_PATH}${path}`;

/** Routes for auth pages. */
const PAGE = {
  ROOT: AUTH_BASE_PATH,
  FORGOT_PASSWORD: withAuthBase("/forget"),
  LOGIN: withAuthBase("/login"),
  REGISTER: withAuthBase("/register"),
  RESET_PASSWORD: withAuthBase("/reset"),
  VERIFY_OTP: withAuthBase("/verify-otp"),
} as const;

/** Auth API routes. */
const API = {
  REGISTER: withApiBasePath("/signup"),
  LOGIN: withApiBasePath("/login"),
  OAUTH_LOGIN: withApiBasePath("/oauth"),
  VERIFY_OTP: withApiBasePath("/verify-email"),
  RESEND_OTP: withApiBasePath("/resendotp"),
  FORGOT_PASSWORD: withApiBasePath("/forgot-password"),
  RESET_PASSWORD: withApiBasePath("/reset-password"),
};

/** Routes for auth app and apis. */
const AUTH_ROUTES = {
  PAGE,
  API,
} as const;

export default AUTH_ROUTES;
