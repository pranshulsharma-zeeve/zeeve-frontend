"use client";
import { ComponentPropsWithoutRef } from "react";
import { Card, Link, StatusIcon } from "@zeeve-platform/ui";
import { formatDate } from "@orbit/utils/helpers";

interface SubscriptionCardProps extends ComponentPropsWithoutRef<"div"> {
  status: string | undefined;
  trialDays?: number;
  end?: Date | string;
}

const SubscriptionInfo = (props: SubscriptionCardProps) => {
  const { end, trialDays, status } = props;
  const endDateString = formatDate(end);
  // Parse the formatted dates into Date objects
  const endDate = new Date(endDateString);
  const timeDifference = endDate.getTime() - Date.now();
  // days remaining from start and end Date
  const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return (
    <>
      {status ? (
        <Card className="col-span-12 flex flex-row items-center gap-3 rounded-lg">
          <StatusIcon status="info" className="rotate-180" />
          <div className="flex-col font-semibold ">
            {status === "not-started" && (
              <div className="font-medium text-brand-dark">
                Get started with <span className="text-brand-purple"> Arbitrum Orbit Testnet</span> today! Deploy and
                run your own blockchain with our end-to-end service. Enjoy a{" "}
                <span className="font-semibold text-brand-red">{trialDays} days</span> trial period with no need to{" "}
                provide your card details. Start building and powering your dedicated blockchain hassle-free!
              </div>
            )}
            {status === "ongoing" && (
              <div className="font-medium text-brand-dark">
                Your <span className="text-brand-purple"> Arbitrum Orbit Testnet</span> is up and running! Please note
                that your trial period will conclude in{" "}
                <span className="font-semibold text-brand-red">{trialDays} days</span> on{" "}
                <span className="font-semibold text-brand-red"> {formatDate(end)}</span>. To continue using
                <span className="text-brand-purple"> Arbitrum Orbit Testnet</span>, make sure to purchase your
                subscription before this date. If not, your
                <span className="text-brand-purple"> Arbitrum Orbit Testnet</span> will be permanently deleted. To
                deploy a new Arbitrum Orbit testnet in the future, a new subscription will be required.
              </div>
            )}
            {status === "purchase_initiated" && (
              <div className="font-medium text-brand-dark">
                <span className="text-brand-purple"> Thank you! </span>
                We&apos;ve initiated the payment process for your subscription. Your trial period is set to expire on{" "}
                <span className="font-semibold text-brand-red">{formatDate(end)}</span>. We will update your{" "}
                subscription and send you a confirmation within the next hour. We appreciate your business and look{" "}
                forward to serving you further.
              </div>
            )}
            {status === "purchase-failed" && (
              <div className="font-medium text-brand-dark">
                We regret to inform you that your payment for{" "}
                <span className="text-brand-purple"> Arbitrum Orbit Testnet </span> has failed. Please attempt the
                payment process again to ensure uninterrupted access to our services. Your trial period is set to expire
                in <span className="font-semibold text-brand-red">{daysLeft} </span> days, on{" "}
                <span className="font-semibold text-brand-red">{formatDate(end)}</span>. To continue using Arbitrum
                Orbit testnet, kindly purchase a subscription before your trial period ends. Reach out to our Support
                team at{" "}
                <Link href="support@zeeve.io" target="_blank">
                  support@zeeve.io
                </Link>{" "}
                for any help.
              </div>
            )}
            {status === "purchased" && (
              <div className="font-medium text-brand-dark">
                <span className="text-brand-purple">Congratulations! </span>
                You&apos;ve successfully purchased the subscription for{" "}
                <span className="text-brand-purple">Arbitrum Orbit Testnet</span>.{" "}
                {daysLeft > 0 ? (
                  <>
                    Your subscription will be activated on the 16th day date, once your trial period ends. Your trial{" "}
                    period is scheduled to expire in <span className="font-semibold text-brand-red">{daysLeft} </span>{" "}
                    days on <span className="font-semibold text-brand-red">{formatDate(end)}</span>. Thank you for{" "}
                    choosing <span className="text-brand-purple">Arbitrum Orbit Testnet</span>, and we look forward to
                    serving you beyond your trial period.
                  </>
                ) : (
                  <>
                    Your trial period has ended and Your{" "}
                    <span className="text-brand-purple">Arbitrum Orbit Testnet</span> subscription is activated
                  </>
                )}
              </div>
            )}
            {status === "ended" && (
              <div className="font-medium text-brand-dark">
                Your subscription period for <span className="text-brand-purple">Arbitrum Orbit Testnet</span> has come
                to an end on <span className="font-semibold text-brand-red">{formatDate(end)}</span>, and your testnet
                has been deleted. To continue using our services and deploy a new{" "}
                <span className="text-brand-purple">Arbitrum Orbit Testnet</span> for your next big project, please
                consider purchasing a subscription. Thank you for choosing{" "}
                <span className="text-brand-purple">Arbitrum Orbit Testnet</span>, and we look forward to supporting
                your future projects.
              </div>
            )}
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default SubscriptionInfo;
