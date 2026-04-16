import DataAvailabilityInfo from "./data-availability-info";
import BatchesData from "./batchesData";
import DAWallet from "./daWallet";
import { walletAddress } from "@/constants/dataAvailability";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const DataAvailability = () => {
  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      <DataAvailabilityInfo />
      <BatchesData />
      <DAWallet address={walletAddress} />
    </div>
  );
};

export default DataAvailability;
