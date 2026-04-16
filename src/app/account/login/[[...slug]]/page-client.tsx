"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { Link, useToast } from "@zeeve-platform/ui";
import * as yup from "yup";
import NoAccountRedirect from "@/components/no-account-redirect";
import SocialLogins from "@/components/social-logins";
import HTTP_STATUS from "@/constants/http";
import ROUTES from "@/routes";
import useAuthService from "@/services/auth/use-auth-service";
import { AuthServiceError } from "@/services/auth/types";
import useBanner from "@/hooks/use-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Password from "@/components/ui/password";
import { PrimaryButton } from "@/components/ui/button";
import { unexpectedError } from "@/constants/error";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";
import { banners, useBannerStore } from "@/store/banner";
import { resolveTrackingDetails, type TrackingParams } from "@/utils/tracking";
import { getConfig } from "@/config";
import { withBasePath } from "@/utils/helpers";
import useAxios from "@/hooks/use-axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import { withApiBasePath } from "@/constants/api";
import { getStoredAccessToken, onAccessTokenChange } from "@/utils/auth-token";
import { useRegistrationStore } from "@/store/registration";

const loginValidationSchema = yup
  .object({
    email: yup.string().required("Email address is required.").email("Must be a valid email address."),
    password: yup.string().required("Password is required."),
  })
  .required();

type LoginValidationSchemaType = yup.InferType<typeof loginValidationSchema>;

const LoginPageClient = () => {
  // dynamic banner
  useBanner();
  const bannerKey = useBannerStore((state) => state.key);
  const [serviceURL, setServiceURL] = useState<string | null>(null);
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    utmTitle: null,
    utmUrl: null,
    protocolId: null,
    sourceUrl: null,
  });
  const [trackingResolved, setTrackingResolved] = useState(false);

  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const config = getConfig();
  const isRecaptchaEnabled = config.reCaptcha?.enabled ?? true;
  const { setAuthToken } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValidationSchemaType>({
    resolver: yupResolver(loginValidationSchema),
    mode: "all",
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { request, url } = useAuthService().login();
  const toast = useToast();
  const router = useRouter();
  const setRegistrationStep = useRegistrationStore((state) => state.setStep);
  const setRegistrationFormData = useRegistrationStore((state) => state.setFormData);

  const handleReCaptchaVerify = useCallback(async (): Promise<string | null> => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return null;
    }

    if (!executeRecaptcha) {
      return null;
    }

    try {
      const token = await executeRecaptcha("login");
      setReCaptchaToken(token);
      return token;
    } catch (error) {
      setReCaptchaToken(null);
      return null;
    }
  }, [executeRecaptcha, isRecaptchaEnabled]);

  const buildAbsoluteUrl = useCallback((target: string): string => {
    if (!target) {
      return target;
    }

    if (/^https?:\/\//i.test(target)) {
      return target;
    }

    if (typeof window === "undefined") {
      return target.startsWith("/") ? target : `/${target}`;
    }

    const normalizedTarget = target.startsWith("/") ? target : `/${target}`;
    return `${window.location.origin}${normalizedTarget}`;
  }, []);

  const normalizeServiceUrl = useCallback((raw: string | null): string | null => {
    if (!raw) {
      return null;
    }

    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }

    const trimmed = decoded.trim();
    if (trimmed.length === 0) {
      return null;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      if (typeof window !== "undefined") {
        try {
          const urlObj = new URL(trimmed);
          const currentOrigin = window.location.origin;
          if (urlObj.origin === currentOrigin) {
            const normalized = `${urlObj.pathname}${urlObj.search}${urlObj.hash}`.replace(/\/{2,}/g, "/") || "/";
            return normalized.startsWith("/") ? normalized : `/${normalized}`;
          }
        } catch {
          // ignore parsing issues and fall back to original value
        }
      }
      return trimmed;
    }

    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }, []);

  const isSafeInternalUrl = useCallback((target: string | null): boolean => {
    if (!target) {
      return false;
    }

    const trimmedTarget = target.trim();
    if (!trimmedTarget) {
      return false;
    }

    if (trimmedTarget.startsWith("/")) {
      return true;
    }

    if (typeof window === "undefined") {
      return false;
    }

    try {
      const urlObj = new URL(trimmedTarget, window.location.origin);
      return urlObj.origin === window.location.origin;
    } catch (error) {
      console.error("[Login] Invalid navigation target", trimmedTarget, error);
      return false;
    }
  }, []);

  // Resolve tracking details for login: prefer UTM data from current URL, otherwise use referrer
  useEffect(() => {
    try {
      const ref = typeof document !== "undefined" ? document.referrer : null;
      const currentHref = typeof window !== "undefined" ? (window.location?.href ?? null) : null;

      const { serviceURL: derivedServiceURL, trackingParams: derivedTracking } = resolveTrackingDetails(
        ref,
        currentHref,
      );

      console.log("[Login] Tracking derived", {
        referrer: ref,
        currentHref,
        serviceURL: derivedServiceURL,
        tracking: derivedTracking,
      });

      setServiceURL(normalizeServiceUrl(derivedServiceURL));
      setTrackingParams(derivedTracking);
    } catch (error) {
      console.error("[Login] Error while resolving tracking details", error);
      setServiceURL(null);
      setTrackingParams({
        utmTitle: null,
        utmUrl: null,
        protocolId: null,
        sourceUrl: null,
      });
    }
    setTrackingResolved(true);
  }, [normalizeServiceUrl]);
  const navigateTo = useCallback(
    (target: string | null | undefined) => {
      if (!target || target.trim().length === 0) {
        return;
      }

      const trimmedTarget = target.trim();
      const isAbsolute = /^https?:\/\//i.test(trimmedTarget);

      if (typeof window !== "undefined") {
        const { origin } = window.location;
        if (isAbsolute && trimmedTarget.startsWith(origin)) {
          const relativePath = trimmedTarget.slice(origin.length) || "/";
          const normalizedPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
          router.replace(normalizedPath);
          return;
        }
      }

      if (isAbsolute) {
        window.open(trimmedTarget, "_self");
        return;
      }

      const normalizedTarget = trimmedTarget.startsWith("/") ? trimmedTarget : `/${trimmedTarget}`;
      router.replace(normalizedTarget);
    },
    [router],
  );
  const hasNavigatedRef = useRef(false);

  const handlePostLoginNavigation = useCallback(() => {
    if (hasNavigatedRef.current) {
      return;
    }
    hasNavigatedRef.current = true;

    const defaultPath = withBasePath(ROUTES.PLATFORM.PAGE.DASHBOARD);
    const fallbackUrl = buildAbsoluteUrl(defaultPath);
    const banner = banners[bannerKey ?? "default"];
    const hasCustomBanner = Boolean(bannerKey && bannerKey !== "default");
    const customTarget = hasCustomBanner ? banner?.url?.trim() : null;
    const destination = customTarget && customTarget.length > 0 ? customTarget : fallbackUrl;

    const fallbackServiceUrl = normalizeServiceUrl(trackingParams.sourceUrl);
    const preferredServiceUrl = normalizeServiceUrl(serviceURL ?? fallbackServiceUrl);
    const normalizedPreferredServiceUrl = preferredServiceUrl?.trim() ?? null;
    const safePreferredServiceUrl =
      normalizedPreferredServiceUrl && isSafeInternalUrl(normalizedPreferredServiceUrl)
        ? normalizedPreferredServiceUrl
        : null;
    const normalizedAuthPrefixes = Array.from(
      new Set(
        [ROUTES.AUTH.PAGE.ROOT, "/auth"]
          .filter((path): path is string => Boolean(path))
          .map((path) => (path.endsWith("/") ? path.slice(0, -1) : path)),
      ),
    );
    const isAuthDestination =
      safePreferredServiceUrl &&
      normalizedAuthPrefixes.some(
        (authPrefix) =>
          safePreferredServiceUrl === authPrefix ||
          safePreferredServiceUrl === `${authPrefix}/` ||
          safePreferredServiceUrl.startsWith(`${authPrefix}/`),
      );

    if (safePreferredServiceUrl && !isAuthDestination) {
      if (
        typeof window !== "undefined" &&
        ["/manage/nodes/full", "/manage/nodes/archive", "/manage/nodes/validator"].some((fragment) =>
          safePreferredServiceUrl.includes(fragment),
        )
      ) {
        try {
          if (safePreferredServiceUrl.startsWith("/")) {
            localStorage.setItem("serviceURL", safePreferredServiceUrl);
          }
        } catch (storageError) {
          console.warn("[Login] Unable to persist serviceURL in localStorage", storageError);
        }
      }
      navigateTo(safePreferredServiceUrl);
      return;
    }

    navigateTo(destination);
  }, [
    bannerKey,
    buildAbsoluteUrl,
    isSafeInternalUrl,
    navigateTo,
    normalizeServiceUrl,
    serviceURL,
    trackingParams.sourceUrl,
  ]);

  const redirectToEmailVerification = useCallback(
    (userEmail: string | undefined) => {
      if (!userEmail) {
        return;
      }

      setRegistrationFormData({
        step: "accountVerification",
        data: { email: userEmail },
      });
      setRegistrationStep("accountVerification");
      router.replace(withBasePath(ROUTES.AUTH.PAGE.REGISTER));
    },
    [router, setRegistrationFormData, setRegistrationStep],
  );

  useEffect(() => {
    if (!trackingResolved || hasNavigatedRef.current) {
      return;
    }

    const existingToken = getStoredAccessToken();
    if (existingToken) {
      handlePostLoginNavigation();
      return;
    }

    const unsubscribe = onAccessTokenChange((token) => {
      if (token && !hasNavigatedRef.current) {
        handlePostLoginNavigation();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [handlePostLoginNavigation, trackingResolved]);

  const onSubmit = async (data: LoginValidationSchemaType) => {
    let resolvedRecaptchaToken = reCaptchaToken;

    if (isRecaptchaEnabled) {
      if (!resolvedRecaptchaToken) {
        resolvedRecaptchaToken = await handleReCaptchaVerify();
      }

      if (!resolvedRecaptchaToken) {
        toast("Verifying captcha", {
          status: "error",
          message: "Please wait a moment and try signing in again.",
        });
        return;
      }
    }

    try {
      const payload: Parameters<typeof request>[1] = {
        ...data,
        client: "mobile",
        ...(isRecaptchaEnabled && resolvedRecaptchaToken ? { recaptcha: resolvedRecaptchaToken } : {}),
      };
      const response = await request(url, payload, {
        withCredentials: true,
      });
      if (response?.status === HTTP_STATUS.OK && response?.data.success) {
        const extractToken = (payload: unknown): string | null => {
          if (!payload) {
            return null;
          }

          if (typeof payload === "string" && payload.trim().length > 0) {
            return payload;
          }

          if (typeof payload === "object") {
            const record = payload as Record<string, unknown>;
            const possibleKeys = [
              "access_token",
              "accessToken",
              "token",
              "bearer_token",
              "bearerToken",
              "jwt",
              "accesstoken",
            ];
            for (const key of possibleKeys) {
              const candidate = record[key];
              if (typeof candidate === "string" && candidate.trim().length > 0) {
                return candidate;
              }
            }
          }

          return null;
        };

        const headerToken = (() => {
          const authHeader = response.headers?.authorization ?? response.headers?.Authorization;
          if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
            return authHeader.slice(7);
          }
          return null;
        })();

        // Always perform an immediate refresh to obtain the latest access token using the refresh cookie
        let accessToken = extractToken(response.data?.data) ?? extractToken(response.data) ?? headerToken;
        try {
          // Try GET /access_token then fallback to POST /refresh for compatibility
          let refreshResp: unknown;
          try {
            refreshResp = await authAxiosInstance.get(withApiBasePath("/access_token"));
          } catch (err) {
            refreshResp = await authAxiosInstance.post(withApiBasePath("/refresh"), {});
          }
          const refreshed = (() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const r = refreshResp as any;
              return extractToken(r?.data?.data) ?? extractToken(r?.data) ?? null;
            } catch {
              return null;
            }
          })();
          if (refreshed) {
            accessToken = refreshed;
          }
        } catch (e) {
          console.warn("[Login] Refresh after login failed", e);
        }

        if (accessToken) {
          setAuthToken(accessToken);
          handlePostLoginNavigation();
          return;
        }

        // If we reach here, we couldn't establish an authenticated session
        toast("", {
          status: "error",
          message: "Login succeeded but session could not be established. Please try again.",
        });

        console.warn("[Login] Successful response without token or message. Staying on login.");
      } else {
        // if success is false
        const requiresVerification =
          Boolean((response?.data as { requires_verification?: boolean })?.requires_verification) ||
          Boolean((response?.data as { requiresVerification?: boolean })?.requiresVerification);

        if (requiresVerification) {
          toast("Verify your email", {
            status: "error",
            message: response.data.message ?? "Please verify your email to continue.",
          });
          redirectToEmailVerification(data.email);
          return;
        }

        toast("", {
          status: "error",
          message: response.data.message ?? response.data?.error?.message ?? unexpectedError,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AuthServiceError>;
        const responseData = axiosError.response?.data as
          | (AuthServiceError & { requires_verification?: boolean; requiresVerification?: boolean })
          | undefined;
        const requiresVerification =
          Boolean(responseData?.requires_verification) || Boolean(responseData?.requiresVerification);
        const backendMessage =
          (responseData as { message?: string } | undefined)?.message ||
          responseData?.error?.message ||
          axiosError.message;
        const normalizedBackendMessage = (backendMessage ?? "").toLowerCase();
        const messageIndicatesVerification = normalizedBackendMessage.includes("email not verified");

        if (
          requiresVerification ||
          (axiosError.response?.status === HTTP_STATUS.FORBIDDEN && messageIndicatesVerification)
        ) {
          toast("Verify your email", {
            status: "error",
            message: backendMessage || "Please verify your email to continue.",
          });
          redirectToEmailVerification(data.email);
          return;
        }

        toast("", {
          status: "error",
          message: backendMessage || unexpectedError,
        });
      } else {
        toast("", {
          status: "error",
          message: unexpectedError,
        });
      }
    } finally {
      if (isRecaptchaEnabled) {
        void handleReCaptchaVerify();
      }
    }
  };

  useEffect(() => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return;
    }

    void handleReCaptchaVerify();
  }, [handleReCaptchaVerify, isRecaptchaEnabled]);

  return (
    <Card>
      <div className="flex flex-col gap-[20px]">
        <FormHeading>Welcome to Zeeve</FormHeading>
        <FormSubheading>Login to your account</FormSubheading>
      </div>

      {/* social logins */}
      <SocialLogins serviceURL={serviceURL} trackingParams={trackingParams} />

      <FormSubheading>Or sign in with your email</FormSubheading>

      {/* form */}
      <form className="flex w-full flex-col gap-[20px] lg:gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[20px]">
          {/* email */}
          <FormField
            label={{
              text: "Email Address",
              isRequired: true,
            }}
            helper={{
              status: "error",
              text: errors.email?.message?.toString(),
            }}
          >
            <Input {...register("email")} type="email" placeholder="your.email@gmail.com" />
          </FormField>

          {/* password */}
          <FormField
            label={{
              text: "Password",
              isRequired: true,
            }}
            helper={{
              status: "error",
              text: errors.password?.message?.toString(),
            }}
          >
            <Password {...register("password")} shouldToggleMask />
          </FormField>

          {/* <Checkbox
            className={tx("h-[18px] w-[18px]")}
            checkboxLabelProps={{
              className: "text-sm font-normal text-brand-gray gap-x-2.5",
            }}
          >
            Remember Me
          </Checkbox> */}
        </div>

        {/* redirection to forgot password page */}
        <Link
          as={NextLink}
          href={
            bannerKey && bannerKey !== "default"
              ? `${ROUTES.AUTH.PAGE.FORGOT_PASSWORD}/${bannerKey}`
              : ROUTES.AUTH.PAGE.FORGOT_PASSWORD
          }
          className="text-sm font-semibold text-brand-primary lg:text-lg"
        >
          Forgot Password?
        </Link>

        <div className="flex flex-col gap-[20px]">
          <PrimaryButton type="submit" isDisabled={!isValid} isLoading={isSubmitting}>
            Sign In
          </PrimaryButton>
          <NoAccountRedirect />
        </div>
      </form>
    </Card>
  );
};

export default LoginPageClient;
