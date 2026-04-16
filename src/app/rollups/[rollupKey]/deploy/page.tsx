import DeployRollupPageClient from "./page-client";

const Page = ({ params }: { params: { rollupKey: string } }) => {
  return <DeployRollupPageClient rollupKey={params.rollupKey} />;
};

export default Page;
