import React from "react";
import { render } from "@testing-library/react";
import LayoutProvider from "@/providers/layout-provider/layout-provider";

describe("Layout regression: single sidebar and header", () => {
  it("renders exactly one .sidebar and one .app-header", () => {
    const { container } = render(
      <LayoutProvider>
        <div>Content</div>
      </LayoutProvider>,
    );

    const sidebars = container.querySelectorAll(".sidebar");
    const headers = container.querySelectorAll(".app-header");

    expect(sidebars.length).toBe(1);
    expect(headers.length).toBe(1);
  });
});
