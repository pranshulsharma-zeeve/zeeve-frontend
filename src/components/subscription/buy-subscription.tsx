"use client";
import Link from "next/link";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";

interface BuySubscriptionProps {
  href: string;
  className?: string;
  nodeType: string;
}

const BuySubscription = (props: BuySubscriptionProps) => {
  const { className, href, nodeType } = props;
  const message =
    nodeType === "full" || nodeType === "archive"
      ? "Hey! You don't have any active node right now, please"
      : "Hey! You don't have any active subscriptions right now, please";
  return (
    <Card
      className={tx("flex flex-row items-center border border-brand-yellow bg-brand-yellow/5 gap-6 w-full", className)}
    >
      <StatusIcon status={"warning"} />
      <div className="flex flex-row items-center justify-around gap-3">
        <div className="font-medium text-brand-dark">
          {message}{" "}
          <Link href={href} className="text-brand-cyan">
            {" "}
            purchase subscription
          </Link>{" "}
          and deploy it.
        </div>
      </div>
    </Card>
  );
};

BuySubscription.displayName = "Buy Subscription Card";
export type { BuySubscriptionProps };
export { BuySubscription };
