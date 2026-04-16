import * as React from "react";
import { SVGProps } from "react";
const IconCheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={13} fill="none" {...props}>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.139 10.669a5 5 0 1 1 0-10.001 5 5 0 0 1 0 10Zm-.688-4.12 3-3a.268.268 0 0 1 .377 0l.34.34a.27.27 0 0 1 0 .377L4.646 7.79a.268.268 0 0 1-.235.073.264.264 0 0 1-.154-.075L2.109 5.642a.268.268 0 0 1 0-.377l.34-.34a.267.267 0 0 1 .377 0l1.625 1.624Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M.139.669h10v10h-10z" />
      </clipPath>
    </defs>
  </svg>
);
export default IconCheckCircle;
