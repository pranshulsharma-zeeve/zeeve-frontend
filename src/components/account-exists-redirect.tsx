"use client";
import React, { useMemo } from "react";
import { Link } from "@zeeve-platform/ui";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import FormSubheading from "./form-subheading";
import ROUTES from "@/routes";
import { useBannerStore } from "@/store/banner";

const AccountExistsRedirect = () => {
  const bannerKey = useBannerStore((state) => state.key);
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const base = bannerKey === "default" ? ROUTES.AUTH.PAGE.LOGIN : `${ROUTES.AUTH.PAGE.LOGIN}/${bannerKey}`;
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  }, [bannerKey, searchParams]);

  return (
    <FormSubheading>
      Already have an account?{" "}
      <Link as={NextLink} href={href} className="font-semibold text-brand-primary">
        Sign in
      </Link>
    </FormSubheading>
  );
};

export default AccountExistsRedirect;
