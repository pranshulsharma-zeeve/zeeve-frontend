"use client";
import { ComponentPropsWithoutRef, ReactElement } from "react";
import { Card, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface UniswapCardProps extends ComponentPropsWithoutRef<"div"> {
  actionButton?: ReactElement;
}

const UniswapCard = (props: UniswapCardProps) => {
  const { className, actionButton, children, ...rest } = props;

  return (
    <Card
      {...rest}
      className={tx("rounded-2xl border border-brand-outline min-h-[255px] w-full gap-3 sm:min-w-[255px]", className)}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-md bg-brand-light">
          <Image
            src={withBasePath("/assets/images/protocol/uniswap-logo.png")}
            width={34}
            height={34}
            alt={`Uniswap Logo`}
            className="bg-white"
          />
        </div>
        <p className="text-base font-semibold leading-[22px] tracking-[0.1px]">Uniswap</p>
      </div>

      <p className="text-sm text-brand-gray">
        Uniswap is a decentralized exchange (DEX) protocol that allows users to...
      </p>
      <hr className="h-[2px] bg-brand-light" />
      {actionButton}
    </Card>
  );
};

UniswapCard.displayName = "Network Card";
export type { UniswapCardProps };
export { UniswapCard };
