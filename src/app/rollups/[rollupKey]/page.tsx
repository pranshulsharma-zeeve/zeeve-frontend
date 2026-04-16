import RollupDashboardPageClient from "./page-client";

const Page = ({ params }: { params: { rollupKey: string } }) => {
  return <RollupDashboardPageClient rollupKey={params.rollupKey} />;
};

export default Page;
