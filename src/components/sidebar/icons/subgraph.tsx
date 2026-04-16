import * as React from "react";
import type { SVGProps } from "react";

const IconSubgraph = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeOpacity={0.2}
      strokeWidth={1.5}
      d="M4.5 12H14m-9.5 0 16 8.5M4.5 12l16-9M14 12l6.5-9M14 12l6.5 8.5m0-17.5v17.5"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M20.445 7.111a3.555 3.555 0 1 0 0-7.11 3.555 3.555 0 0 0 0 7.11ZM20.445 24a3.556 3.556 0 1 0 0-7.111 3.556 3.556 0 0 0 0 7.111ZM14.222 14.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"
      clipRule="evenodd"
    />
    <path fill="currentColor" d="M8.889 12A4.444 4.444 0 1 1 0 12a4.444 4.444 0 0 1 8.889 0Z" />
  </svg>
);

export default IconSubgraph;
