import RollupNetworkDetailsClient from "./page-client";

const Page = ({ params }: { params: { rollupKey: string; id: string } }) => {
  return <RollupNetworkDetailsClient rollupKey={params.rollupKey} id={params.id} />;
};

export default Page;
