import * as React from "react";
import type { SVGProps } from "react";

const IconCorda = (props: SVGProps<SVGSVGElement>) => (
  <svg
    version="1.1"
    id="layer"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 652 652"
    fill="white"
    width="24"
    height="24"
    {...props}
  >
    {/* Small circle - colored red */}
    <path
      fill="#E52328"
      d="M654.6,365.7c0,23-18.8,41.8-41.8,41.8s-41.8-18.8-41.8-41.8c0-23,18.8-41.8,41.8-41.8S654.6,342.5,654.6,365.7"
    />
    {/* Rest of the icon - default white fill (inherited from SVG) */}
    <path
      d="M405.7,242.1l56.8-82.5V75.9H281.7l-57.5,83.6h136.4l-70.1,102.1l41.8,72.5c12.4-7.1,26.8-11.3,42.4-11.3
        c46.7,0,84.7,37.8,84.7,84.7s-38,84.7-84.7,84.7s-84.7-38-84.7-84.7h-83.6c0,93,75.4,168.4,168.2,168.4c93,0,168.4-75.4,168.4-168.4
        C542.8,325.2,483.6,256.7,405.7,242.1 M166.6,75.9c-30.7,0-59.3,8.2-84.2,22.6V75.9H-1.4v331.6h83.8V243.9
        c0-46.6,37.6-84.2,84.2-84.2l28.1-0.2l57.5-83.6H166.6z"
    />
  </svg>
);

export default IconCorda;
