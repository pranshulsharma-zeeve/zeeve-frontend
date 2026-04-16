"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ROUTES from "@/routes";
import { useRegistrationStore } from "@/store/registration";
import { withBasePath } from "@/utils/helpers";
import { PrimaryButton } from "@/components/ui/button";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";
import { useBannerStore } from "@/store/banner";

const RegistrationSuccess = () => {
  const router = useRouter();
  const { reset } = useRegistrationStore();
  const bannerKey = useBannerStore((state) => state.key);

  useEffect(() => {
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <Image
        src={withBasePath("/assets/images/others/gradient-circle-check.svg")}
        alt="registration success"
        width={80}
        height={80}
        className="self-center"
      />

      <div className="flex flex-col gap-[20px]">
        <FormHeading>You have successfully created Zeeve account.</FormHeading>
        <FormSubheading>Now you can start using our platform.</FormSubheading>
      </div>

      <PrimaryButton
        type="button"
        isFullWidth
        onClick={() => {
          router.replace(bannerKey === "default" ? ROUTES.AUTH.PAGE.LOGIN : `${ROUTES.AUTH.PAGE.LOGIN}/${bannerKey}`);
        }}
      >
        Go to Zeeve
      </PrimaryButton>
    </Card>
  );
};

export default RegistrationSuccess;
