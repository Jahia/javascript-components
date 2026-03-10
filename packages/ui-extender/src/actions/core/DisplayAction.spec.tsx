import { useEffect, useState } from "react";
import { DisplayAction } from "./DisplayAction";
import { registry } from "../..";
import { ButtonRenderer } from "../samples/ButtonRenderer";
import { LinkRenderer } from "../samples/LinkRenderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { act } from "react-dom/test-utils";

describe("DisplayAction", () => {
  beforeEach(() => {
    registry.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call onClick when button is click", async () => {
    const action = registry.addOrReplace("action", "test-action-1", {
      label: "Simple action",
      onClick: vi.fn(),
    });

    const wrapper = await render(
      <DisplayAction
        actionKey="test-action-1"
        path="/test1"
        render={ButtonRenderer}
      />
    );

    expect(action.onClick.mock.calls.length).toBe(0);
    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    expect(action.onClick.mock.calls.length).toBe(1);
  });

  it("should call method with different values", async () => {
    const fn1 = vi.fn();

    registry.addOrReplace("action", "test-action-1", {
      label: "test action 1",
      value: "test1",
      onClick: fn1,
    });
    registry.addOrReplace("action", "test-action-2", {
      label: "test action 2",
      value: "test2",
      onClick: fn1,
    });
    const wrapper = await render(
      <>
        <DisplayAction
          actionKey="test-action-1"
          path="/test1"
          render={ButtonRenderer}
        />
        <DisplayAction
          actionKey="test-action-2"
          path="/test1"
          render={ButtonRenderer}
        />
      </>
    );
    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();
    expect(fn1.mock.calls.length).toBe(2);
    expect(fn1.mock.calls[0][0].value).toBe("test1");
    expect(fn1.mock.calls[1][0].value).toBe("test2");
  });

  it("should call method with different contexts", async () => {
    const fn1 = vi.fn();

    registry.addOrReplace("action", "test-action-1", {
      label: "test action 1",
      onClick: fn1,
    });
    const wrapper = await render(
      <>
        <DisplayAction
          actionKey="test-action-1"
          path="/test1"
          render={ButtonRenderer}
        />
        <DisplayAction
          actionKey="test-action-1"
          path="/test2"
          render={ButtonRenderer}
        />
      </>
    );
    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();
    expect(fn1.mock.calls.length).toBe(2);
    expect(fn1.mock.calls[0][0].path).toBe("/test1");
    expect(fn1.mock.calls[1][0].path).toBe("/test2");
  });

  it("Renderer", async () => {
    registry.addOrReplace("action", "test-action-1", {
      label: "test action 1",
      onClick: vi.fn(),
    });

    const wrapper = await render(
      <>
        <DisplayAction
          actionKey="test-action-1"
          path="/test"
          render={ButtonRenderer}
        />
        <DisplayAction
          actionKey="test-action-1"
          path="/test"
          render={LinkRenderer}
        />
      </>
    );

    expect(wrapper.baseElement.querySelectorAll("button").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll("span").length).toBe(1);
  });

  it("should handle composition on onClick", async () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const base = registry.addOrReplace("action", "base", {
      onClick: fn1,
      arrayExample: ["value1"],
    });
    registry.addOrReplace("action", "compose-1", base, {
      param: "1",
      label: "compose 1",
      arrayExample: ["value2"],
    });
    registry.addOrReplace("action", "compose-2", base, {
      param: "2",
      label: "compose 2",
      onClick: fn2,
    });

    const wrapper = await render(
      <>
        <DisplayAction
          actionKey="compose-1"
          path="/test1"
          render={ButtonRenderer}
        />
        <DisplayAction
          actionKey="compose-2"
          path="/test1"
          render={ButtonRenderer}
        />
      </>
    );

    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();

    expect(fn1.mock.calls.length).toBe(1);
    expect(fn1.mock.calls[0][0].param).toBe("1");

    expect(fn2.mock.calls.length).toBe(1);
    expect(fn2.mock.calls[0][0].param).toBe("2");
    expect(fn2.mock.calls[0][2]).toBe(fn1);
  });

  it("should render component action", async () => {
    const fn1 = vi.fn();
    const TestComponent1 = ({ render: Render, ...props }) => (
      <Render {...props} onClick={fn1} />
    );

    registry.addOrReplace("action", "component-1", {
      label: "component 1",
      component: TestComponent1,
    });
    const wrapper = await render(
      <DisplayAction
        actionKey="component-1"
        path="/test1"
        render={ButtonRenderer}
      />
    );

    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();
    expect(fn1.mock.calls.length).toBe(1);
    expect(fn1.mock.calls[0][0].path).toBe("/test1");
  });

  it("handle component composition", async () => {
    const fn1 = vi.fn();

    const TestComponent1 = ({ render: Render, ...props }) => (
      <Render {...props} onClick={fn1} />
    );

    const TestComponent2 = (
      { render, label, ...props },
      refOrContext,
      Previous
    ) => (
      <Previous
        extended
        render={render}
        label={label + " overriden"}
        {...props}
      />
    );

    const base = registry.addOrReplace("action", "base", {
      component: TestComponent1,
    });
    registry.addOrReplace("action", "component-compose-1", base, {
      param: "1",
      label: "compose 1",
    });
    registry.addOrReplace("action", "component-compose-2", base, {
      param: "2",
      label: "compose 2",
      component: TestComponent2,
    });
    const wrapper = await render(
      <>
        <DisplayAction
          actionKey="component-compose-1"
          path="/test1"
          render={ButtonRenderer}
        />
        <DisplayAction
          actionKey="component-compose-2"
          path="/test1"
          render={ButtonRenderer}
        />
      </>
    );

    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();
    expect(fn1.mock.calls.length).toBe(2);
    expect(fn1.mock.calls[0][0].path).toBe("/test1");
    expect(fn1.mock.calls[0][0].param).toBe("1");
    expect(fn1.mock.calls[1][0].path).toBe("/test1");
    expect(fn1.mock.calls[1][0].param).toBe("2");
    expect(fn1.mock.calls[1][0].extended).toBe(true);
  });

  it("should update its rendering when using async components", async () => {
    const fn1 = vi.fn();

    const AsyncComponent = ({ render: Render, label, ...props }) => {
      const [value, setValue] = useState(1);
      useEffect(() => {
        const t = setInterval(() => {
          act(() => setValue(value + 1));
        }, 1000);
        return () => {
          clearInterval(t);
        };
      }, [value]);
      return value > 1 ? (
        <Render label={label + value} value={value} {...props} onClick={fn1} />
      ) : (
        <span>loading..</span>
      );
    };

    registry.addOrReplace("action", "async", {
      label: "async",
      component: AsyncComponent,
    });

    const wrapper = await render(
      <DisplayAction actionKey="async" path="/test1" render={ButtonRenderer} />
    );
    expect(wrapper.baseElement.querySelectorAll("button").length).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(wrapper.baseElement.querySelectorAll("button").length).toBe(1);
    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    expect(fn1.mock.calls.length).toBe(1);
    expect(fn1.mock.calls[0][0].value).toBe(2);
  });

  it("should be able to spawn multiple buttons", async () => {
    const fn1 = vi.fn();
    const SpawnActionsComponent = ({
      render: Render,
      names,
      label,
      ...props
    }) =>
      names.map((name) => (
        <Render
          key={name}
          name={name}
          label={label + " " + name}
          {...props}
          onClick={fn1}
        />
      ));

    registry.addOrReplace("action", "spawn", {
      label: "child action",
      names: ["child1", "child2", "child3"],
      component: SpawnActionsComponent,
    });

    const wrapper = await render(
      <DisplayAction actionKey="spawn" path="/test1" render={ButtonRenderer} />
    );

    for (const button of wrapper.baseElement.querySelectorAll("button"))
      await page.elementLocator(button).click();
    expect(fn1.mock.calls.length).toBe(3);
    expect(fn1.mock.calls[0][0].path).toBe("/test1");
    expect(fn1.mock.calls[0][0].name).toBe("child1");
    expect(fn1.mock.calls[1][0].name).toBe("child2");
    expect(fn1.mock.calls[2][0].name).toBe("child3");
  });
});
