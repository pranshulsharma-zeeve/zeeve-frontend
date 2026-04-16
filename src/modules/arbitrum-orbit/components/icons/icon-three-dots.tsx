import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgThreeDots = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="0.5" y="1" width="23" height="23" rx="5.5" stroke="white" />
    <rect x="10" y="4.5" width="4" height="4" rx="2" fill="white" />
    <rect x="10" y="10.5" width="4" height="4" rx="2" fill="white" />
    <rect x="10" y="16.5" width="4" height="4" rx="2" fill="white" />
  </svg>
);
SvgThreeDots.displayName = "IconThreeDots";
export default SvgThreeDots;
