"use client";
import React, { useEffect, useState } from "react";
import { Heading } from "@zeeve-platform/ui";
import ZeeveLogo from "../zeeve-logo";
import CarouselBanner from "./carousel-banner";
import { banners, useBannerStore } from "@/store/banner";

const LeftSection = () => {
  const { key } = useBannerStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex w-4/5 flex-col items-center gap-[60px]">
      <ZeeveLogo />

      <div className="flex flex-col items-center gap-[30px] text-center">
        {key ? (
          <>
            <Heading as="h2" className="text-[28px] text-brand-primary">
              {banners[key].heading}
            </Heading>
            <div className="px-16">
              <p className="text-center text-lg text-brand-gray">{banners[key].text}</p>
            </div>
          </>
        ) : null}
      </div>

      <CarouselBanner />
    </div>
  );
};

export default LeftSection;
