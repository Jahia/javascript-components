import { ReactNode, useContext, useEffect } from "react";
import { ComponentRendererProvider } from "./ComponentRendererProvider";
import { ComponentRendererContext } from "./ComponentRendererContext";
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";

// Use global variables to check the lifecycles
let RenderedComponentProps: unknown;
let RenderedComponentDestroyed = 0;
const RenderedComponent = (props: { label: ReactNode }) => {
  useEffect(
    () => () => {
      RenderedComponentDestroyed += 1;
    },
    []
  );
  RenderedComponentProps = props;
  return <div className="component">{props.label}</div>;
};

const Render = () => {
  const renderer = useContext(ComponentRendererContext);

  return (
    <>
      <button
        type="button"
        className="open"
        onClick={() =>
          renderer.render("test", RenderedComponent, { label: "test" })
        }
      >
        Open
      </button>
      <button
        type="button"
        className="update"
        onClick={() => renderer.setProperties("test", { label: "updated" })}
      >
        Update
      </button>
      <button
        type="button"
        className="destroy"
        onClick={() => renderer.destroy("test")}
      >
        Destroy
      </button>
    </>
  );
};

describe("ComponentRenderer", () => {
  it("should render the component", async () => {
    const wrapper = await render(
      <ComponentRendererProvider>
        <Render />
      </ComponentRendererProvider>
    );

    await page
      .elementLocator(wrapper.baseElement.querySelector(".open")!)
      .click();

    expect(RenderedComponentProps).toStrictEqual({ label: "test" });

    await page
      .elementLocator(wrapper.baseElement.querySelector(".update")!)
      .click();

    expect(RenderedComponentProps).toStrictEqual({ label: "updated" });

    await page
      .elementLocator(wrapper.baseElement.querySelector(".destroy")!)
      .click();

    expect(RenderedComponentDestroyed).toBe(1);
  });
});
