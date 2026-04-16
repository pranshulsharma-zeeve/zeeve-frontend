import * as React from "react";
import { SVGProps } from "react";

const IconClock = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} fill="none" {...props}>
    <path
      fill="currentColor"
      d="M9.661 18.439a8.814 8.814 0 1 1 0-17.628 8.814 8.814 0 0 1 0 17.628Zm0-16.453a7.639 7.639 0 1 0 0 15.277 7.639 7.639 0 0 0 0-15.277Z"
    />
    <path
      fill="currentColor"
      d="m12.152 12.95-2.908-2.908a.588.588 0 0 1-.17-.418v-4.7h1.175v4.46l2.738 2.732-.835.834Z"
    />
  </svg>
);

export default IconClock;
