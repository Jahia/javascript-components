import { federation } from "@module-federation/vite";
import type { ModuleFederationOptions } from "@module-federation/vite/lib/utils/normalizeModuleFederationOptions";
import moduleFederationVitePkg from "@module-federation/vite/package.json" with { type: "json" };
import { existsSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";
import pkg from "../package.json" with { type: "json" };

/**
 * Vite Plugin for Jahia's Module Federation setup.
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
     * By default all package.json dependencies are shared as singletons.
     *
     * Additional dependencies can be specified here.
     */
    shared?: Record<
      string,
      {
        /** @see https://module-federation.io/configure/shared.html#singleton */
        singleton?: boolean;
        /** @see https://module-federation.io/configure/shared.html#requiredVersion */
        requiredVersion?: string;
        strictVersion?: boolean;
      }
    >;
  } & Omit<ModuleFederationOptions, "name" | "filename" | "exposes" | "shared">,
): Plugin[] {
  const { name, dependencies = {}, jahia = {} } = readPackageJson();

  // Unless explicitly specified, use the package name as the federation module name
  options.name ??= name;

  if (!options.name) {
    throw new Error("Federation module name is not defined in options and package.json.");
  }

  return [
    {
      name: "jahia-federation-plugin",
      config(config) {
        return {
          esbuild: { jsx: "automatic" },
          base: "", // Ensure all assets are emitted with relative paths
          define: {
            "process.env.NODE_ENV": JSON.stringify(
              config.build?.watch ? "development" : "production",
            ),
          },
          build: {
            sourcemap: true,
            minify: !config.build?.watch,
            rollupOptions: { input: Object.values(options.exposes) },
          },
        };
      },
      buildEnd() {
        // We assume these files are exposed under the "javascript/apps" path live,
        // regardless of the actual output directory configured in Vite.
        this.emitFile({
          type: "asset",
          fileName: "remoteEntry.js",
          source: `appShell.remotes[${JSON.stringify(name)}]={builder:"${pkg.name}@${pkg.version} ${moduleFederationVitePkg.name}@${moduleFederationVitePkg.version}",async init(...a){const m=await import("./index.js");await m.init(...a);Object.assign(this,m)}};`,
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
      ...options,
      name: options.name,
      filename: "index.js", // Referenced in the emitted remoteEntry.js
      shared: {
        ...Object.fromEntries(Object.keys(dependencies).map((dep) => [dep, { singleton: true }])),
        ...options.shared,
      },
      remotes: {
        // Common remotes provided by official Jahia modules
        "@jahia/jcontent": "window:appShell.remotes.jcontent",
        "@jahia/jahia-ui-root": "window:appShell.remotes.jahiaUi",
        ckeditor5: "window:appShell.remotes.ckeditor5",
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
