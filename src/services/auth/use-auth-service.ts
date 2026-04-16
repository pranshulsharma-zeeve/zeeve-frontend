import useForgotPasswordAPI from "./forgot-password";
import useLoginAPI from "./login";
import useOauthLoginAPI from "./oauth-login";
import useRegisterAPI from "./register";
import useResendOTPAPI from "./resend-otp";
import useResetPasswordAPI from "./reset-password";
import useVerifyOTPAPI from "./verify-otp";

/** hook to use auth service */
const useAuthService = () => {
  return {
    forgotPassword: useForgotPasswordAPI,
    login: useLoginAPI,
    register: useRegisterAPI,
    resendOTP: useResendOTPAPI,
    resetPassword: useResetPasswordAPI,
    verifyOTP: useVerifyOTPAPI,
    oauthLogin: useOauthLoginAPI,
  };
};

export default useAuthService;
