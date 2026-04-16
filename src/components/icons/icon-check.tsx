import * as React from "react";
import { SVGProps } from "react";

const IconCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={27} fill="currentFill" {...props}>
    <path
      fill="currentFill"
      stroke="currentColor"
      d="m15.963 4.156.164.162.23-.02 4.337-.36.398 4.334.02.23.189.133 3.554 2.512-2.48 3.575-.132.19.059.223 1.108 4.208-4.2 1.145-.222.06-.098.21-1.856 3.936-3.953-1.823-.209-.096-.21.096-3.952 1.823-1.856-3.937-.098-.208-.223-.06-4.199-1.146 1.109-4.208.058-.223-.131-.19-2.481-3.575 3.554-2.512.189-.133.02-.23.399-4.334 4.337.36.23.02.163-.162 3.091-3.064 3.09 3.064Z"
    />
    <path stroke="currentColor" d="m7.193 13.434 3.886 3.332 6.846-7.032" />
  </svg>
);

export default IconCheck;
