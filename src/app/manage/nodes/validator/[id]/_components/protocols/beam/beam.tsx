import React from "react";
import GeneralInfo from "./_components/general-info";
import { NetworkInfo } from "@/store/network";

const BeamProtocol = ({ data }: NetworkInfo) => {
  let dcomm = false;

  if (data?.protocol.id === "72e6d0f2-2e7a-11ed-a261-0242ac120002") {
    dcomm = true;
  } else {
    dcomm = false;
  }
  return (
    <div className="grid grid-cols-12 gap-2 text-brand-dark lg:gap-6">
      <GeneralInfo
        blsKey={data?.nodes[0]?.metaData?.blsKey}
        blsProof={data?.nodes[0]?.metaData?.blsProof}
        nodeId={data?.nodes[0]?.metaData?.nodeId}
        dcomm={dcomm}
      />
    </div>
  );
};

export default BeamProtocol;
