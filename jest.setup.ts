import "@testing-library/jest-dom";

// Mock next/navigation hooks used by LayoutProvider
jest.mock("next/navigation", () => ({
  usePathname: () => "/arbitrum-orbit",
}));

// Mock the heavy Sidebar component to avoid asset imports during tests
jest.mock("@/components/sidebar", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props: any) => React.createElement("aside", { className: "mocked-sidebar", ...props }),
  };
});

// Mock the Header to avoid UI dependencies (toast, WS, etc.)
jest.mock("@/providers/layout-provider/header", () => {
  const React = require("react");
  const Header = ({ handleMobileSidebarOpen }: { handleMobileSidebarOpen: () => void }) =>
    React.createElement(
      "div",
      { className: "app-header" },
      React.createElement("button", { onClick: handleMobileSidebarOpen }, "menu"),
    );
  return { __esModule: true, default: Header };
});

// Provide a basic ResizeObserver mock for components that rely on it
class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

// @ts-ignore
global.ResizeObserver = ResizeObserverMock;
