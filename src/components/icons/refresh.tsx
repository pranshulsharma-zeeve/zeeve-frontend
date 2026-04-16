import * as React from "react";
import type { SVGProps } from "react";
const SvgRefreshComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" {...props}>
    <path
      fill="#AAABB8"
      fillRule="evenodd"
      d="M4.3 4.813c-1.3 1.3-2.1 3-2.3 4.8v.9H0v-1.1c.3-2.3 1.3-4.4 2.9-6 3.9-3.9 10.3-3.9 14.2 0l1.9-1.9v5h-5l1.7-1.7c-1.6-1.5-3.7-2.3-5.7-2.3-2.1 0-4.1.8-5.7 2.3Zm11.4 11.4c1.5-1.5 2.3-3.6 2.3-5.7h2c0 2.6-1 5.2-2.9 7.1-1.9 1.9-4.4 2.9-7.1 2.9-2.7 0-5.2-1-7.1-2.9l-1.9 1.9v-5h5l-1.7 1.7c1.6 1.5 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgRefreshComponent;
