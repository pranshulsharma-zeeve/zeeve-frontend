import * as React from "react";
import { SVGProps } from "react";

const IconLatestTransactions = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" {...props}>
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M18.39.059H2.61C1.44.059.5 1.009.5 2.169v15.78c0 1.16.94 2.1 2.11 2.1h15.77c1.16 0 2.11-.94 2.11-2.1V2.169c0-1.16-.95-2.11-2.11-2.11h.01Zm1.04 17.9c0 .57-.47 1.05-1.05 1.05H2.61c-.58 0-1.05-.47-1.05-1.05V2.169c0-.57.46-1.05 1.05-1.05h15.77c.57 0 1.05.47 1.05 1.05v15.79Z" />
      <path d="M15.63 7.558H6.26l1.46-1.46c.1-.1.15-.24.15-.38s-.05-.28-.15-.38c-.1-.1-.24-.15-.38-.15-.13 0-.27.05-.38.15L4.6 7.708c-.15.15-.21.38-.12.58.08.19.28.33.49.33h10.66c.29 0 .53-.24.53-.53a.54.54 0 0 0-.53-.53ZM16.91 12.219a.548.548 0 0 0-.49-.33H5.76a.54.54 0 0 0-.53.53c0 .28.25.53.53.53h9.36l-1.46 1.46c-.1.1-.15.24-.15.38s.05.28.15.38c.21.21.54.21.75 0l2.37-2.37c.15-.15.21-.38.12-.58h.01Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M.5.059h20v20H.5z" />
      </clipPath>
    </defs>
  </svg>
);

export default IconLatestTransactions;
