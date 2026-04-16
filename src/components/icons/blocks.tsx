import * as React from "react";
import { SVGProps } from "react";

const IconBlocks = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={21} fill="none" {...props}>
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="m8.697.617-8.66 5.01v9.99l8.66 5.01 8.66-5.01v-9.99L8.697.617Zm-.45 18.72-7.32-4.23v-8.47l7.32 4.23v8.47Zm-6.88-13.46 7.33-4.23 7.32 4.23-7.32 4.22-7.33-4.22Zm15.1 9.23-7.32 4.23v-8.46l7.32-4.23v8.46Z"
      />
    </g>
  </svg>
);

export default IconBlocks;
