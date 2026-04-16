"use client";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";
import { banners, useBannerStore } from "@/store/banner";

const CarouselBanner = () => {
  const { key } = useBannerStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !key) {
    return null;
  }

  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      infiniteLoop
      autoPlay
      interval={5000}
      transitionTime={1000}
      className="max-h-[260px] max-w-[444px]"
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        return (
          <button
            style={{
              width: "12px",
              height: "12px",
              background: isSelected ? "#020381" : "#DFE5E6",
              boxShadow: "none",
              marginLeft: "24px",
              borderRadius: "100%",
            }}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            key={index}
            tabIndex={0}
            aria-label={`${label} ${index + 1}`}
          />
        );
      }}
    >
      {banners[key].images.map((img) => {
        return <Image key={img.src} src={withBasePath(img.src)} alt={img.alt} height={260} width={444} priority />;
      })}
    </Carousel>
  );
};

export default CarouselBanner;
