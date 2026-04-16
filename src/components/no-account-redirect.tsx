"use client";
import React, { useMemo } from "react";
import { Link } from "@zeeve-platform/ui";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import FormSubheading from "./form-subheading";
import ROUTES from "@/routes";
import { useBannerStore } from "@/store/banner";

const NoAccountRedirect = () => {
  const bannerKey = useBannerStore((state) => state.key);
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const base = bannerKey === "default" ? ROUTES.AUTH.PAGE.REGISTER : `${ROUTES.AUTH.PAGE.REGISTER}/${bannerKey}`;
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  }, [bannerKey, searchParams]);

  return (
    <FormSubheading>
      Don&apos;t have an account?{" "}
      <Link as={NextLink} href={href} className="font-semibold text-brand-primary">
        Sign up now
      </Link>
    </FormSubheading>
  );
};

export default NoAccountRedirect;
