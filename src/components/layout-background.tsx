"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/utils/helpers";

/**
 * Helper function to get the background image for a route or its subroutes
 * @param currentPath - The current pathname
 * @param bgMap - Map of base routes to background images
 * @param defaultBg - Default background image to use if no match is found
 * @returns The appropriate background image path
 */
const getBackgroundForRoute = (currentPath: string, bgMap: Record<string, string>, defaultBg: string): string => {
  // First, check for exact match
  if (bgMap[currentPath]) {
    return bgMap[currentPath];
  }

  // Then, check if current path starts with any base route
  // Sort by length (descending) to match the most specific route first
  const sortedRoutes = Object.keys(bgMap).sort((a, b) => b.length - a.length);

  for (const baseRoute of sortedRoutes) {
    if (currentPath.startsWith(baseRoute + "/") || currentPath === baseRoute) {
      return bgMap[baseRoute];
    }
  }

  return defaultBg;
};

const LayoutBackground = () => {
  const route = usePathname();

  const backgroundImageMap: Record<string, string> = {
    "/besu": "/assets/images/backgrounds/bg-besu.svg",
    "/fabric": "/assets/images/backgrounds/bg-fabric.svg",
    "/arbitrum-orbit": "/assets/images/backgrounds/bg-arbitrum-orbit.svg",
    "/opstack": "/assets/images/backgrounds/bg-opstack.svg",
    "/settings": "/assets/images/backgrounds/bg-settings.svg",
  };

  const bgSrc = getBackgroundForRoute(route, backgroundImageMap, "/assets/images/backgrounds/bg.svg");
  return (
    <div className="layout-background pointer-events-none fixed inset-0 z-0 select-none" aria-hidden="true">
      <Image
        src={withBasePath(bgSrc)}
        alt="Layout Background"
        aria-hidden
        draggable={false}
        fill
        className="select-none object-cover object-center"
        priority
      />
    </div>
  );
};

export default LayoutBackground;
