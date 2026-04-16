"use client";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";
import Link from "next/link";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { useSuperNetStore } from "@/store/super-net";
import ROUTES from "@/routes";
import { useUserStore } from "@/store/user";

type InfoProps = {
  className?: string;
};

const DemoSupernetInfo = ({ className }: InfoProps) => {
  const supernetInfo = useSuperNetStore((state) => state.superNetInfo);
  const user = useUserStore((state) => state.user);

  if (!supernetInfo.data || supernetInfo.isLoading || supernetInfo.data.ownedBy === user?.usercred) {
    return null;
  }

  return (
    <Card
      className={tx(
        "col-span-12 flex flex-row items-center gap-3 border border-brand-yellow bg-brand-yellow/5",
        className,
      )}
    >
      <StatusIcon status={"warning"} />
      <div className="2xl:flex 2xl:grow 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="font-medium text-brand-dark">
          This is a fully functional demo <span className="text-brand-primary">Polygon CDK testnet</span>. This instance
          is available to all users. If you want to deploy your own network (for which only you or your organization has
          access), you can do that from the
          <Link href={ROUTES.VALIDIUM.PAGE.LIST} className="text-brand-primary">
            {" "}
            Deploy Testnet
            <IconArrowUpRightFromSquare className="mx-1 inline" />
          </Link>{" "}
          option.
        </div>
      </div>
    </Card>
  );
};

export default DemoSupernetInfo;
