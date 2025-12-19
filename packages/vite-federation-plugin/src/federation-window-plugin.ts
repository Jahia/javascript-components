import type { ModuleFederationRuntimePlugin } from "@module-federation/runtime-core";

/**
 * This runtime plugin "loads" remotes from the global window object.
 *
 * Usage example: `{ '@jahia/jcontent': 'window:appShell.remotes.jcontent' }`
 */
export default function FederationWindowPlugin(): ModuleFederationRuntimePlugin {
  return {
    name: "federation-window-plugin",
    async loadEntry({ remoteInfo }) {
      if (remoteInfo.type !== "var") return;
      const { protocol, pathname } = new URL(remoteInfo.entry);
      if (protocol !== "window:") return;
      let mod: any = window;
      for (const segment of pathname.split(".")) mod = mod[segment];
      return mod;
    },
  };
}
