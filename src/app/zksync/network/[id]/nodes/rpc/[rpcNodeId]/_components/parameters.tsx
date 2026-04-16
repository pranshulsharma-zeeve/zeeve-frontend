"use client";
import React from "react";
import Health from "./health";
import LatestBlock from "./latest-block";

const Parameters = () => {
  return (
    <div className="col-span-12 flex flex-col md:col-span-12 lg:col-span-2">
      <div className="grid grid-cols-12 gap-3 text-brand-dark">
        <Health />
        <LatestBlock />
      </div>
    </div>
  );
};

export default Parameters;
