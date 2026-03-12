import { DisplayActions } from "../core/DisplayActions";
import { registry, ComponentRendererProvider } from "../..";
import { componentRendererAction } from "./componentRenderAction";
import { Modal } from "../samples/Modal";
import { ButtonRenderer } from "../samples/ButtonRenderer";
import { describe, beforeEach, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

describe("DisplayActions", () => {
  beforeEach(() => {
    registry.clear();
  });

  it("should display component on click", async () => {
    const openModalAction = registry.addOrReplace(
      "action",
      "base-component",
      componentRendererAction,
      {
        componentToRender: Modal,
      }
    );

    registry.addOrReplace("action", "renderer-1", openModalAction, {
      targets: ["target-renderer"],
      label: "component 1",
      content: "test 1",
    });
    registry.addOrReplace("action", "renderer-2", openModalAction, {
      targets: ["target-renderer"],
      label: "component 2",
      content: "test 2",
    });

    const wrapper = await render(
      <ComponentRendererProvider>
        <DisplayActions
          target="target-renderer"
          context={{ path: "/test" }}
          render={ButtonRenderer}
        />
      </ComponentRendererProvider>
    );

    expect(wrapper.baseElement.querySelectorAll(".modal").length).toBe(0);
    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    expect(wrapper.baseElement.querySelectorAll(".modal").length).toBe(1);
    expect(
      page.elementLocator(wrapper.baseElement.querySelector(".modal div")!)
    ).toHaveTextContent("test 1");
    await page
      .elementLocator(wrapper.baseElement.querySelector(".backdrop")!)
      // If we click in the center (default), the click is intercepted
      .click({ position: { x: 100, y: 100 } });
    expect(wrapper.baseElement.querySelectorAll(".modal").length).toBe(0);
    await page
      .elementLocator(wrapper.baseElement.querySelectorAll("button")[1]!)
      .click();
    expect(wrapper.baseElement.querySelectorAll(".modal").length).toBe(1);
    expect(
      page.elementLocator(wrapper.baseElement.querySelector(".modal div")!)
    ).toHaveTextContent("test 2");
  });
});
