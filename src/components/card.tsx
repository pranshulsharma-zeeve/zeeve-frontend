"use client";
import React, { PropsWithChildren } from "react";
import { IconChevronLeft } from "@zeeve-platform/icons/arrow/outline";
import { Button } from "@zeeve-platform/ui";
import { useRegistrationStore } from "@/store/registration";

const Card = ({ children }: PropsWithChildren) => {
  const step = useRegistrationStore((state) => state.step);
  const setStep = useRegistrationStore((state) => state.setStep);

  return (
    <div className="flex w-full flex-col items-start gap-[20px] overflow-hidden rounded-[10px] bg-white/55 p-[20px] shadow-2xl shadow-brand-light backdrop-blur-sm lg:w-4/5 lg:gap-[40px] lg:p-[60px]">
      {/* change email button */}
      {step === "accountVerification" ? (
        <Button
          className="w-max justify-self-start px-0 text-xs"
          variant="text"
          iconLeft={<IconChevronLeft className="text-sm text-brand-dark" />}
          onClick={() => setStep("registrationForm")}
        >
          Change Email
        </Button>
      ) : null}

      {children}
    </div>
  );
};

export default Card;
