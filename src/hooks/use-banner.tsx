"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BannerKey, banners, useBannerStore } from "@/store/banner";

const useBanner = () => {
  const setBanner = useBannerStore((state) => state.setBanner);

  const params = useParams<{ slug: string[] }>();
  const slug = params.slug?.[0] as unknown as BannerKey;

  useEffect(() => {
    setBanner(Object.hasOwn(banners, slug) ? slug : "default");
  }, [setBanner, slug]);
};

export default useBanner;
