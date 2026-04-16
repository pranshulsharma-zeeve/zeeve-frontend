"use client";
import { useParams } from "next/navigation";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";
import Link from "next/link";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { POLYGON_CDK_DEMO_SERVICE_ID } from "@/constants/polygon-cdk";

type InfoProps = {
  className?: string;
};

const DemoNetworkInfo = ({ className }: InfoProps) => {
  const params = useParams();
  const serviceId = params?.id;
  const normalizedId = Array.isArray(serviceId) ? serviceId[0] : serviceId;
  const isDemo = Boolean(normalizedId && normalizedId === POLYGON_CDK_DEMO_SERVICE_ID);

  if (!isDemo) return null;

  return (
    <Card
      className={tx(
        "col-span-12 flex flex-row items-center gap-3 border border-brand-yellow bg-brand-yellow/5",
        className,
      )}
    >
      <StatusIcon status={"warning"} />
      <div className="2xl:flex 2xl:grow 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="text-sm font-medium text-brand-dark">
          Fully functional demo Polygon CDK testnet, available to all users. Deploy a private network via
          <Link href="/polygon-cdk/deploy" className="text-brand-primary">
            {" "}
            Deploy Testnet
            <IconArrowUpRightFromSquare className="mx-1 inline" />
          </Link>
          .
        </div>
      </div>
    </Card>
  );
};

export default DemoNetworkInfo;
