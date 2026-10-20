import { federation } from "@module-federation/vite";
import type { ModuleFederationOptions } from "@module-federation/vite";
import moduleFederationVitePkg from "@module-federation/vite/package.json" with { type: "json" };
import { existsSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";
import pkg from "../package.json" with { type: "json" };
import { getShared, type SharedConfig } from "./shared.js";

/**
 * Vite Plugin for Jahia's Module Federation setup.
 *
 * The package.json is the module federation manifest:
 *
 * - `peerDependencies` are shared as singletons and imported from the host
 *   (`{ singleton: true, import: false }`), so they are not bundled in the remote.
 * - `dependencies` are bundled in the remote and shared pooled, i.e. deduplicated with the
 *   other federated modules at runtime.
 * - `devDependencies` are bundled and tree-shaken, and not shared at all. This is the right
 *   place for large libraries only a subset of which is used, e.g. `lodash` or `clsx`.
 *
 * For now, this plugin assumes that the output directory is "javascript/apps" live.
 */
export default function jahiaFederationPlugin(
  options: {
    /** Name of the module in `appShell.remotes` and for the rest of the federation. Defaults to package.json name. */
    name?: string;

    /** Modules to consume from other federated modules. */
    exposes: {
      /** Entrypoint used to load the UI extension. */
      "./init": string;
      /** Entrypoint used to expose exports to federated modules. */
      "."?: string;
    } & Record<string, string>;

    /**
     * By default `peerDependencies` are shared as singletons imported from the host, and
     * `dependencies` are bundled and shared pooled.
     *
     * Entries here are merged last and override that default. They also skip the checks
     * that libraries are in the right bucket, e.g. to target a host this plugin does not
     * know yet.
     *
     * @see https://module-federation.io/configure/shared.html
     */
    shared?: Record<string, SharedConfig>;
  } & Omit<ModuleFederationOptions, "name" | "filename" | "exposes" | "shared">,
): Plugin[] {
  const packageJson = readPackageJson();
  const { name, jahia = {} } = packageJson;

  // Unless explicitly specified, use the package name as the federation module name
  options.name ??= name;

  if (!options.name) {
    throw new Error("Federation module name is not defined in options and package.json.");
  }

  const shared = getShared(packageJson, options.shared);

  return [
    {
      name: "jahia-federation-plugin",
      config(config) {
        return {
          input: Object.values(options.exposes),
          esbuild: { jsx: "automatic" },
          base: "", // Ensure all assets are emitted with relative paths
          define: {
            "process.env.NODE_ENV": JSON.stringify(
              config.build?.watch ? "development" : "production",
            ),
            // Apollo Client >= 3.8 only disables its dev-only behavior (deep-freezing cache
            // results, verbose invariant messages) when globalThis.__DEV__ is explicitly false
            "globalThis.__DEV__": JSON.stringify(Boolean(config.build?.watch)),
          },
          build: {
            sourcemap: true,
            minify: config.build?.minify ?? !config.build?.watch,
          },
        };
      },
      buildEnd() {
        // We assume these files are exposed under the "javascript/apps" path live,
        // regardless of the actual output directory configured in Vite.
        this.emitFile({
          type: "asset",
          fileName: "remoteEntry.js",
          source: `appShell.remotes[${JSON.stringify(options.name)}]={builder:"${pkg.name}@${pkg.version} ${moduleFederationVitePkg.name}@${moduleFederationVitePkg.version}",async init(...a){const m=await import("./index.js");await m.init(...a);Object.assign(this,m)}};`,
        });
        this.emitFile({
          type: "asset",
          fileName: "package.json",
          source: JSON.stringify({
            jahia: {
              ...jahia,
              remotes: {
                jahia: "javascript/apps/remoteEntry.js",
                ...jahia?.remotes,
              },
            },
          }),
        });
      },
    },
    ...federation({
      dts: false,
      manifest: true,
      ...options,
      name: options.name,
      filename: "index.js", // Referenced in the emitted remoteEntry.js
      shared,
      remotes: {
        // Common remotes provided by official Jahia modules
        "@jahia/jcontent": "window:appShell.remotes.jcontent",
        "@jahia/jahia-ui-root": "window:appShell.remotes.jahiaUi",
        ckeditor5: "window:appShell.remotes.richtextCkeditor5",
        ...options.remotes,
      },
      // Resolves to the build output of ./federation-window-plugin.ts
      runtimePlugins: [pkg.name + "/federation-window-plugin", ...(options.runtimePlugins ?? [])],
    }),
  ];
}

function readPackageJson() {
  if (existsSync("package.json")) {
    return JSON.parse(readFileSync("package.json", "utf-8"));
  }

  if (!process.env.npm_package_json) {
    throw new Error("npm_package_json is not defined in the env vars.");
  }

  return JSON.parse(readFileSync(process.env.npm_package_json, "utf-8"));
}
