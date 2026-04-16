"use client";
import { Heading, tx, Z4DashboardCard } from "@zeeve-platform/ui";

const PaymentVerificationCard = () => {
  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType="testnet" className="flex size-full grow flex-col">
        <div className={tx("flex flex-col items-center gap-6 text-sm")}>
          {/* Success Icon */}
          <div className="mt-4 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-green-200/40" />
              <div className="relative flex size-16 items-center justify-center rounded-full bg-green-100">
                <svg className="size-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <Heading
            className={tx("text-brand-testnet font-normal flex w-full items-center justify-center text-lg text-center")}
            as="h5"
          >
            Payment Successful
          </Heading>

          {/* Description */}
          <div className="flex w-full flex-col gap-2 text-center">
            <p className="text-sm font-medium text-[#09122D]">Thank you for your payment!</p>
            <p className="text-xs text-[#6B7280]">
              We are verifying your payment at our end. This may take a few moments.
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <div className="size-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0s" }} />
              <div className="size-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0.15s" }} />
              <div className="size-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0.3s" }} />
            </div>
            <p className="text-xs font-medium text-[#6B7280]">Verifying...</p>
          </div>

          {/* Additional Info */}
          <div className="w-full rounded-lg bg-blue-50 p-3">
            <p className="text-center text-xs text-[#1F2937]">
              {"You'll be redirected once verification is complete."}
            </p>
          </div>

          <div className="grow" />

          {/* Footer Message */}
          <div className="w-full border-t border-[#DEDEDE] pt-3">
            <p className="text-center text-xs text-[#6B7280]">
              {"Refresh the page if you don't see updates in a few moments."}
            </p>
          </div>
        </div>
      </Z4DashboardCard>
    </div>
  );
};

export default PaymentVerificationCard;
