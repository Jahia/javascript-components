import { act, useEffect, useState } from "react";
import { DisplayAction } from "../core/DisplayAction";
import { registry } from "../..";
import { menuAction } from "./menuAction";
import { ButtonRenderer } from "../samples/ButtonRenderer";
import { ComponentRendererProvider } from "../../ComponentRenderer/ComponentRendererProvider";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

const MenuRenderer = ({
  menuKey,
  isSubMenu,
  isOpen,
  isLoading,
  onClose,
  onExited,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  // Simulate close animation, calls onExited after isOpen is set to false
  const [previousOpen, setPreviousOpen] = useState(false);
  if (previousOpen !== isOpen) {
    setTimeout(() => {
      act(() => {
        if (isOpen) {
          setPreviousOpen(isOpen);
        } else {
          onExited();
        }
      });
    }, 0);
  }

  return (
    <>
      {!isSubMenu && <div className="backdrop" onClick={onClose} />}
      <div
        className={isOpen && !isLoading ? "menu" : "xxxx"}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="menuItems" id={"menu-" + menuKey}>
          {children}
        </div>
      </div>
    </>
  );
};

const MenuItemRenderer = ({
  label,
  actionKey,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className="menuItem"
    id={"item-" + actionKey}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {label}
  </div>
);

const readyList = [];

const AsyncComponent = ({ render: Render, loading: Loading, ...props }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      readyList.push(props.id);
      setReady(true);
    }, props.minTime);
    return () => {
      clearTimeout(t);
    };
  }, [props.id, props.minTime]);
  if (!ready && readyList.indexOf(props.id) === -1) {
    if (props.isUseLoading && Loading) {
      return <Loading {...props} />;
    }

    return false;
  }

  return <Render {...props} onClick={vi.fn} />;
};

function addMenu(key, targets, isMenuPreload) {
  registry.addOrReplace("action", key, menuAction, {
    label: key,
    targets,
    isMenuPreload,
    menuTarget: key,
    menuRenderer: MenuRenderer,
    menuItemRenderer: MenuItemRenderer,
  });
}

function addItem(key, targets, fn) {
  registry.addOrReplace("action", key, {
    targets,
    label: key,
    onClick: fn,
  });
}

/* eslint-disable max-params */
function addAsyncItem(key, targets, minTime, isUseLoading, isVisible) {
  registry.addOrReplace("action", key, {
    targets,
    label: key,
    minTime,
    isUseLoading,
    isVisible,
    component: AsyncComponent,
  });
}

async function advanceTime(timeout = 100) {
  act(() => {
    vi.advanceTimersByTime(timeout);
  });
}

async function getWrapper() {
  return render(
    <ComponentRendererProvider>
      <DisplayAction actionKey="menu" path="/test" render={ButtonRenderer} />
    </ComponentRendererProvider>
  );
}

describe("Menu", () => {
  beforeEach(() => {
    registry.clear();
    readyList.length = 0;
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => vi.runAllTimers());
    vi.useRealTimers();
  });

  it("should open menu on click", async () => {
    const fn = vi.fn();

    addMenu("menu", []);
    addItem("item1", ["menu"], fn);
    addItem("item2", ["menu"], fn);
    addItem("item3", ["menu"], fn);

    const wrapper = await getWrapper();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);
    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();

    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      3
    );
  });

  it("should close when clicking on backdrop", async () => {
    const fn = vi.fn();

    addMenu("menu", []);
    addItem("item1", ["menu"], fn);
    addItem("item2", ["menu"], fn);
    addItem("item3", ["menu"], fn);

    const wrapper = await getWrapper();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();

    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".backdrop").length).toBe(1);

    // Note: we cannot use locator.click() because without CSS the backdrop has height: 0
    // and cannot be clicked from a locator because it requires the element to be visible
    wrapper.baseElement.querySelector<HTMLElement>(".backdrop")!.click();

    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);
  });

  it("should call method and close when clicking on an item", async () => {
    const fn = vi.fn();

    addMenu("menu", []);
    addItem("item1", ["menu"], fn);
    addItem("item2", ["menu"], fn);
    addItem("item3", ["menu"], fn);

    const wrapper = await getWrapper();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();

    await advanceTime();

    await page
      .elementLocator(wrapper.baseElement.querySelector(".menu .menuItem")!)
      .click();

    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].label).toBe("item1");
  });

  it("should open sub menu on hover and close all on click item", async () => {
    const fn = vi.fn();

    addMenu("menu", []);
    addMenu("submenu1", ["menu:4"]);
    addMenu("submenu2", ["menu:5", "submenu1:2"]);
    addItem("item1", ["menu:1", "submenu1:1", "submenu2:1"], fn);
    addItem("item2", ["menu:2"], fn);
    addItem("item3", ["menu:3"], fn);

    const wrapper = await getWrapper();

    // Open main menu
    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      5
    );

    // Hover 5th item (submenu-3)
    await page
      .elementLocator(
        wrapper.baseElement.querySelectorAll(".menu .menuItem")[4]
      )
      .hover();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(2);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      6
    );

    // Hover 4th item (submenu-2), previous sub-menu should be closed
    await page
      .elementLocator(
        wrapper.baseElement.querySelectorAll(".menu .menuItem")[3]
      )
      .hover();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(2);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      7
    );

    // Hover sub-sub-menu item
    await page
      .elementLocator(
        wrapper.baseElement.querySelectorAll(".menu .menuItem")[6]
      )
      .hover();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(3);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      8
    );

    // Click item in sub-sub-menu
    await page
      .elementLocator(
        wrapper.baseElement.querySelector("#menu-submenu2 #item-item1")!
      )
      .click();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].label).toBe("item1");
  });

  it("should update when using asynchronouns items", async () => {
    addMenu("menu", []);
    addAsyncItem("async-item1", ["menu"], 0);
    addAsyncItem("async-item2", ["menu"], 200);
    addAsyncItem("async-item3", ["menu"], 300);

    const wrapper = await getWrapper();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    await advanceTime();
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      1
    );

    await advanceTime();
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      2
    );

    await advanceTime();
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      3
    );
  });

  it("should appear when loaded when using asynchronouns items with loading", async () => {
    addMenu("menu", [], false);
    addAsyncItem("async-item1", ["menu"], 0, true);
    addAsyncItem("async-item2", ["menu"], 200, true);
    addAsyncItem("async-item3", ["menu"], 300, true);

    const wrapper = await getWrapper();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);

    await advanceTime();
    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(0);
    //
    await advanceTime();
    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      3
    );
  });

  it("should preload menu", async () => {
    addMenu("menu", [], true);
    addAsyncItem("async-item0", ["menu:1"], 0, true);
    addAsyncItem("async-item1", ["menu:1"], 200, true);
    addAsyncItem("async-item2", ["menu:1"], 300, true);

    const wrapper = await getWrapper();

    await advanceTime();
    await advanceTime();
    await advanceTime();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      3
    );
  });

  it("should not render empty menu", async () => {
    addMenu("menu", [], false);
    addMenu("submenu1", ["menu"], true);
    addMenu("submenu2", ["menu"], true);
    addAsyncItem(
      "async-item1",
      ["menu", "submenu1", "submenu2"],
      100,
      true,
      false
    );
    addAsyncItem("async-item2", ["menu"], 100, true);
    addAsyncItem("async-item3", ["menu"], 100, true);

    const wrapper = await getWrapper();

    await page
      .elementLocator(wrapper.baseElement.querySelector("button")!)
      .click();
    await advanceTime();

    expect(wrapper.baseElement.querySelectorAll(".menu").length).toBe(1);
    expect(wrapper.baseElement.querySelectorAll(".menu .menuItem").length).toBe(
      2
    );
  });
});
