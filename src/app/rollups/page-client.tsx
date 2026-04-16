"use client";
import React from "react";
import { Card, Button, Z4Navigation } from "@zeeve-platform/ui";
import Image from "next/image";
import Link from "next/link";
import { rollupRegistry } from "@/rollups";
import { withBasePath } from "@/utils/helpers";
import { getPreferredBasePath } from "@/utils/path";
import ROUTES from "@/routes";

const RollupsIndexPageClient = () => {
  const base = getPreferredBasePath();
  const items = Object.values(rollupRegistry);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading="Rollups"
        breadcrumb={{
          items: [
            { href: `${base}${ROUTES.PLATFORM.PAGE.DASHBOARD}` as string, label: "Dashboard", as: Link },
            { href: `${base}/rollups`, label: "Rollups", isActive: true, as: Link },
          ],
        }}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.key} className="flex flex-col gap-3 p-4">
            {item.logo ? <Image src={withBasePath(item.logo)} alt={item.displayName} width={32} height={32} /> : null}
            <h3 className="text-lg font-semibold">{item.displayName}</h3>
            <Link href={`${base}/rollups/${item.key}`} className="w-fit">
              <Button>Open</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RollupsIndexPageClient;
