"use client";
import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResetPasswordStore } from "@/store/reset-password";
import ROUTES from "@/routes";
import { withBasePath } from "@/utils/helpers";
import { PrimaryButton } from "@/components/ui/button";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";

const ResetPasswordSuccess = () => {
  const router = useRouter();
  const { reset } = useResetPasswordStore();
  const redirectToLogin = useCallback(() => {
    router.replace(ROUTES.AUTH.PAGE.LOGIN);
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      redirectToLogin();
    }, 2000);

    return () => {
      clearTimeout(timer);
      reset();
    };
  }, [redirectToLogin, reset]);

  return (
    <Card>
      <Image
        src={withBasePath("/assets/images/others/gradient-circle-check.svg")}
        alt="reset password success"
        width={80}
        height={80}
        className="self-center"
      />

      <div className="flex flex-col gap-[20px]">
        <FormHeading>You have successfully changed your password.</FormHeading>
        <FormSubheading>Now you can login with your new password.</FormSubheading>
      </div>

      <PrimaryButton type="button" isFullWidth onClick={redirectToLogin}>
        Go to Login
      </PrimaryButton>
    </Card>
  );
};

export default ResetPasswordSuccess;
