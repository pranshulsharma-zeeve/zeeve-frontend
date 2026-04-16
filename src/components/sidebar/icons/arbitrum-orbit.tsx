import * as React from "react";
import type { SVGProps } from "react";

const IconArbitrumOrbit = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Outer Hexagon Border */}
    <path
      d="M16 0c-.5 0-1 .13-1.45.38L2.45 7.45A2.62 2.62 0 0 0 1 9.72v12.56c0 1 .53 1.9 1.45 2.38l12.1 7.06c.45.26.95.38 1.45.38s1-.13 1.45-.38l12.1-7.06A2.62 2.62 0 0 0 31 22.28V9.72a2.62 2.62 0 0 0-1.45-2.27L17.45.38A2.62 2.62 0 0 0 16 0Z"
      fill="#213147"
      stroke="#9DCCED"
      strokeWidth={1.5}
    />

    {/* Right Blue Strips */}
    <path d="M18 11l-1.8 4.8a.5.5 0 0 0 0 .4l3 8.1 3.4-1.9-4.1-10.8a.3.3 0 0 0-.5 0Z" fill="#12AAFF" />
    <path d="M21.5 7.5a.3.3 0 0 0-.5 0l-1.8 4.8a.5.5 0 0 0 0 .4l4.8 12.8 3.4-1.9-5.9-15.9Z" fill="#12AAFF" />

    {/* Left White Strips */}
    <path d="m7.2 28.5 1.2-3.2 2.4 2-2.2 2-1.4-.8Z" fill="white" />
    <path d="M14.3 8.2h-3.3a.5.5 0 0 0-.5.4L4 27.3l3.4 1.9 7.8-20.9a.3.3 0 0 0-.3-.4Z" fill="white" />
    <path d="M20.1 8.2h-3.3a.5.5 0 0 0-.5.4l-7.6 20.3 3.4 1.9L20.4 8.6a.3.3 0 0 0-.3-.4Z" fill="white" />
  </svg>
);

export default IconArbitrumOrbit;
