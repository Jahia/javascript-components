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
      if (remoteInfo.type !== "var" || !remoteInfo.entry.startsWith("window:"))
        return;
      const { pathname } = new URL(remoteInfo.entry);

      return {
        init() {
          // The container has already been initialized by the app shell, and cannot be initialized twice (throws RUNTIME-015)
          // Do nothing
        },
        get(id) {
          // Resolved on each call: the runtime caches this entry, and the container may register after it
          let container: any = window;
          for (const segment of pathname.split("."))
            container = container?.[segment];

          if (!container) {
            throw new Error(
              `'${pathname}' is undefined. Make sure the Jahia module supposed to provide it is loaded correctly.`
            );
          }

          return container.get(id);
        },
      };
    },
  };
}
