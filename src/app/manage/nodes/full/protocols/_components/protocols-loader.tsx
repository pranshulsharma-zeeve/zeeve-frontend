"use client";

const ProtocolsSidebarLoader = () => {
  return [1, 2, 3, 4, 5, 6, 7].map((i) => (
    <div key={i} className="my-5 h-11 animate-pulse rounded bg-gray-50 dark:bg-gray-700" />
  ));
};

const ProtocolsCardLoader = () => {
  return (
    <div className="col-span-4 animate-pulse gap-3 rounded-2xl bg-white pr-6 lg:col-span-1">
      <div className={`col-span-4 mb-6 mt-14 rounded-2xl border shadow-md transition-all lg:col-span-1`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="mb-5 h-11 rounded bg-gray-50 dark:bg-gray-700"></div>
        ))}
      </div>
    </div>
  );
};

const ProtocolsItemLoader = () => {
  return (
    <div className="grid animate-pulse grid-cols-12 gap-3 rounded-2xl lg:gap-6">
      <div className="col-span-12 mb-5 h-12 rounded bg-gray-100 lg:col-span-6"></div>
      <div className="col-span-12 mb-5 h-12 rounded bg-gray-100 lg:col-span-6"></div>
    </div>
  );
};

export { ProtocolsSidebarLoader, ProtocolsCardLoader, ProtocolsItemLoader };
