import type { ModuleFederationRuntimePlugin } from "@module-federation/runtime-core";

/**
 * This runtime plugin "loads" remotes from the global window object.
 *
 * Usage example: `{ '@jahia/jcontent': 'window:appShell.remotes.jcontent' }`
 *
 * The app shell has already initialized these containers with its own share scope, and a
 * webpack container refuses a second one (RUNTIME-015), so the entry's `init` does nothing.
 */
export default function FederationWindowPlugin(): ModuleFederationRuntimePlugin {
  return {
    name: "federation-window-plugin",
    async loadEntry({ remoteInfo }) {
      if (remoteInfo.type !== "var") return;
      const { protocol, pathname } = new URL(remoteInfo.entry);
      if (protocol !== "window:") return;
      let container: any = window;
      for (const segment of pathname.split(".")) container = container[segment];
      if (!container) return;
      // Read `get` on each call: the remoteEntry.js of a Vite module only adds it in `init`
      return { init() {}, get: (id) => container.get(id) };
    },
  };
}
