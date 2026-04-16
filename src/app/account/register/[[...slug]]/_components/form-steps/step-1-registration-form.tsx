"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormFieldStatus, Link, tx, useToast } from "@zeeve-platform/ui";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRegistrationStore } from "@/store/registration";
import useAuthService from "@/services/auth/use-auth-service";
import { AuthServiceError } from "@/services/auth/types";
import { REGEX_PASSWORD } from "@/constants/regex";
import HTTP_STATUS from "@/constants/http";
import SocialLogins from "@/components/social-logins";
import AccountExistsRedirect from "@/components/account-exists-redirect";
import { getConfig } from "@/config";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Password from "@/components/ui/password";
import Checkbox from "@/components/ui/checkbox";
import { PrimaryButton } from "@/components/ui/button";
import { unexpectedError } from "@/constants/error";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import { resolveTrackingDetails, type TrackingParams } from "@/utils/tracking";
import { encodeToBase64Url } from "@/utils/base64";
import { banners, useBannerStore } from "@/store/banner";
import ROUTES from "@/routes";
import { withBasePath } from "@/utils/helpers";
import { getStoredAccessToken, onAccessTokenChange } from "@/utils/auth-token";

const registrationFormValidationSchema = yup
  .object({
    first_name: yup
      .string()
      .required("First name is required.")
      .test("is-valid", "Only alphabets, numbers and spaces are allowed", (value) => {
        // do not allow empty string
        if (value === "") return false;
        // reject non-string or non-matching values
        return /^[A-Za-z0-9\s]+$/.test(value);
      }),
    last_name: yup
      .string()
      .required("Last name is required.")
      .test("is-valid", "Only alphabets, numbers and spaces are allowed", (value) => {
        // do not allow empty string
        if (value === "") return false;
        // reject non-string or non-matching values
        return /^[A-Za-z0-9\s]+$/.test(value);
      }),
    email: yup.string().required("Email address is required.").email("Must be a valid email address."),
    password: yup
      .string()
      .required("Password is required.")
      .matches(
        REGEX_PASSWORD,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character.",
      ),
    confirm_password: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("password")], "Passwords do not match."),
    acceptTerms: yup.bool().oneOf([true], "Please agree T&C.").required(),
  })
  .required();

type RegistrationFormValidationSchemaType = yup.InferType<typeof registrationFormValidationSchema>;

const RegistrationForm = () => {
  const { registrationForm, setFormData, setStep } = useRegistrationStore();
  const bannerKey = useBannerStore((state) => state.key);
  const router = useRouter();

  const config = getConfig();
  const isRecaptchaEnabled = config.reCaptcha?.enabled ?? true;

  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const [serviceURL, setServiceURL] = useState<string | null>(null);
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    utmTitle: null,
    utmUrl: null,
    protocolId: null,
    sourceUrl: null,
  });
  const [trackingResolved, setTrackingResolved] = useState(false);
  const hasNavigatedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<RegistrationFormValidationSchemaType>({
    resolver: yupResolver(registrationFormValidationSchema),
    mode: "all",
    defaultValues: registrationForm ?? {},
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { request, url } = useAuthService().register();
  const toast = useToast();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return;
    }

    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha("register");
    setReCaptchaToken(token);
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
          // ignore parse errors
        }
      }
      return trimmed;
    }

    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }, []);
  const safeDecode = useCallback((value: string | null) => {
    if (!value) {
      return null;
    }

    try {
      return decodeURIComponent(value);
    } catch (error) {
      console.error("[Registration] Failed to decode value", value, error);
      return value;
    }
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
      console.error("[Registration] Invalid navigation target", trimmedTarget, error);
      return false;
    }
  }, []);

  const handlePostSignupNavigation = useCallback(() => {
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
          console.warn("[Registration] Unable to persist serviceURL in localStorage", storageError);
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

  useEffect(() => {
    if (!trackingResolved || hasNavigatedRef.current) {
      return;
    }

    const existingToken = getStoredAccessToken();
    if (existingToken) {
      handlePostSignupNavigation();
      return;
    }

    const unsubscribe = onAccessTokenChange((token) => {
      if (token && !hasNavigatedRef.current) {
        handlePostSignupNavigation();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [handlePostSignupNavigation, trackingResolved]);

  // Resolve tracking details by preferring current URL UTM params over referrer
  useEffect(() => {
    try {
      const ref = typeof document !== "undefined" ? document.referrer : null;
      const currentHref = typeof window !== "undefined" ? (window.location?.href ?? null) : null;

      const { serviceURL: derivedServiceURL, trackingParams: derivedTracking } = resolveTrackingDetails(
        ref,
        currentHref,
      );

      console.log("[Registration] Tracking derived", {
        referrer: ref,
        currentHref,
        serviceURL: derivedServiceURL,
        tracking: derivedTracking,
      });

      setServiceURL(normalizeServiceUrl(derivedServiceURL));
      setTrackingParams(derivedTracking);
    } catch (err) {
      console.error("[Registration] Error while resolving tracking details", err);
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

  const onSubmit = async (data: RegistrationFormValidationSchemaType) => {
    console.log("[Registration] Form submitted with data:", data);
    console.log("[Registration] reCaptchaToken:", reCaptchaToken);
    console.log("[Registration] serviceURL:", serviceURL);
    console.log("[Registration] trackingParams:", trackingParams);

    setFormData({
      step: "registrationForm",
      data,
    });

    if (isRecaptchaEnabled && !reCaptchaToken) {
      return;
    }

    try {
      let updatedUrl;
      let utmEncodedString: string | null = null;

      if (trackingParams.sourceUrl || serviceURL) {
        const protocol = trackingParams.protocolId ? PROTOCOL_MAPPING[trackingParams.protocolId] : null;
        console.log("[Registration] protocol mapping:", protocol);

        const rawUtmTitle = trackingParams.utmTitle;
        const rawUtmUrl = trackingParams.utmUrl;
        console.log("[Registration] rawUtmTitle:", rawUtmTitle);
        console.log("[Registration] rawUtmUrl:", rawUtmUrl);

        const decodedUtmUrl = safeDecode(rawUtmUrl);
        console.log("[Registration] decodedUtmUrl:", decodedUtmUrl);

        const utmTitle = rawUtmTitle ? rawUtmTitle.slice(0, 250) : null;
        const utmUrl = decodedUtmUrl ? decodedUtmUrl.slice(0, 50) : null;

        console.log("[Registration] Final utmTitle:", utmTitle);
        console.log("[Registration] Final utmUrl:", utmUrl);

        const utm = {
          utm_source: utmUrl ? utmUrl : "zeeve.io",
          utm_medium: protocol ? protocol.name : utmTitle ? utmTitle : "default",
          SiteTarget: "app.zeeve.io",
        };

        console.log("[Registration] UTM object:", utm);

        utmEncodedString = encodeToBase64Url(JSON.stringify(utm));

        console.log("[Registration] Encoded utm string:", utmEncodedString);

        updatedUrl = `${url}?utm_info=${utmEncodedString}`;
        console.log("[Registration] Updated URL:", updatedUrl);
      }

      const payload = {
        ...data,
        client: "mobile" as const,
        ...(isRecaptchaEnabled && reCaptchaToken ? { recaptcha: reCaptchaToken } : {}),
        ...(utmEncodedString ? { utm_information: utmEncodedString } : {}),
      };

      const response = await request(updatedUrl ?? url, payload);

      console.log("[Registration] API response:", response);

      const isSuccessfulStatus = response?.status === HTTP_STATUS.CREATED || response?.status === HTTP_STATUS.OK;

      if (isSuccessfulStatus && response?.data.success) {
        toast("Account created successfully.", {
          status: "success",
          message: "Check your email and verify your account.",
        });
        setStep("accountVerification");
      } else {
        const errorMessage = response.data?.message ?? response.data?.error?.message ?? unexpectedError;
        console.warn("[Registration] Registration failed:", errorMessage, response.data);
        toast("", {
          status: "error",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("[Registration] Submit error:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AuthServiceError>;
        const errorMessage =
          axiosError.response?.data?.message ?? axiosError.response?.data?.error?.message ?? unexpectedError;
        toast("", {
          status: "error",
          message: errorMessage,
        });
      } else {
        toast("", {
          status: "error",
          message: unexpectedError,
        });
      }
    } finally {
      if (isRecaptchaEnabled) {
        console.log("[Registration] Refreshing reCaptcha...");
        handleReCaptchaVerify();
      }
    }
  };

  useEffect(() => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return;
    }

    handleReCaptchaVerify();
  }, [handleReCaptchaVerify, isRecaptchaEnabled]);

  return (
    <Card>
      <div className="flex flex-col gap-[20px]">
        <FormHeading>Create an account</FormHeading>
        {/* <FormSubheading>Register your account</FormSubheading> */}
      </div>

      {/* social login buttons */}
      <SocialLogins serviceURL={serviceURL} trackingParams={trackingParams} />

      <FormSubheading>Or sign up with your email</FormSubheading>

      {/*  form */}
      <form className="flex w-full flex-col gap-[20px] lg:gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[20px]">
          {/* name inputs */}
          <div className="grid grid-cols-12 items-start gap-[20px]">
            <FormField
              className="col-span-12 lg:col-span-6"
              label={{
                text: "First Name",
                isRequired: true,
              }}
              helper={{
                status: "error",
                text: errors.first_name?.message?.toString(),
              }}
            >
              <Input
                {...register("first_name", {
                  setValueAs: (value) => {
                    const trimmed = value?.trim();
                    return trimmed === "" ? undefined : trimmed;
                  },
                })}
                type="text"
                placeholder="First name"
              />
            </FormField>

            <FormField
              className="col-span-12 lg:col-span-6"
              label={{
                text: "Last Name",
                isRequired: true,
              }}
              helper={{
                status: "error",
                text: errors.last_name?.message?.toString(),
              }}
            >
              <Input
                {...register("last_name", {
                  setValueAs: (value) => {
                    const trimmed = value?.trim();
                    return trimmed === "" ? undefined : trimmed;
                  },
                })}
                type="text"
                placeholder="Last name"
              />
            </FormField>
          </div>

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

          <div className="flex flex-col gap-1">
            {/* password inputs */}
            <div className="grid grid-cols-12 items-start gap-[20px]">
              {/* password */}
              <FormField
                className="col-span-12 h-full justify-between lg:col-span-6"
                label={{
                  text: "Password",
                  isRequired: true,
                }}
              >
                <Password {...register("password")} shouldToggleMask />
              </FormField>

              {/* confirm password */}
              <FormField
                className="col-span-12 lg:col-span-6"
                label={{
                  text: "Confirm Password",
                  isRequired: true,
                }}
              >
                <Password {...register("confirm_password")} shouldToggleMask />
              </FormField>
            </div>

            {/* show if password or confirm_password input has an error */}
            {errors.password || errors.confirm_password ? (
              <FormFieldStatus className="text-xs *:shrink-0 lg:text-sm" status="error">
                {errors.password?.message?.toString() ?? errors.confirm_password?.message?.toString()}
              </FormFieldStatus>
            ) : null}
          </div>

          {/* T&C */}
          <Checkbox
            {...register("acceptTerms")}
            className={tx({
              "border-brand-red": errors.acceptTerms?.message,
            })}
          >
            <p className="break-words text-start text-xs text-brand-gray lg:text-sm">
              By registering I agree to the{" "}
              <Link as={NextLink} className="text-brand-primary" href={config.other?.termsOfService ?? "#"}>
                Terms of Services
              </Link>
              ,{" "}
              <Link as={NextLink} className="text-brand-primary" href={config.other?.cookiePolicy ?? "#"}>
                Cookie Policy
              </Link>
              ,{" "}
              <Link as={NextLink} className="text-brand-primary" href={config.other?.privacyPolicy ?? "#"}>
                Privacy Policy
              </Link>
              .
            </p>
          </Checkbox>
        </div>

        <div className="flex flex-col gap-[20px]">
          <PrimaryButton type="submit" isDisabled={!isValid} isLoading={isSubmitting}>
            Sign Up
          </PrimaryButton>
          <AccountExistsRedirect />
        </div>
      </form>
    </Card>
  );
};

export type { RegistrationFormValidationSchemaType };
export default RegistrationForm;
