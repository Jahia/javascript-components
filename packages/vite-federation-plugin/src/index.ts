import { federation } from "@module-federation/vite";
import type { ModuleFederationOptions } from "@module-federation/vite";
import moduleFederationVitePkg from "@module-federation/vite/package.json" with { type: "json" };
import { existsSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";
import pkg from "../package.json" with { type: "json" };

/**
 * Libraries the federation host (the app-shell) provides as singletons.
 *
 * @see https://github.com/Jahia/gautier-braindump/issues/71
 */
const hostSingletons = new Set([
  "react",
  "react-dom",
  "react-router",
  "react-redux",
  "redux",
  "i18next",
  "react-i18next",
  "formik",
  "@jahia/ui-extender",
  // Deprecated since 2019, remove once no remote renders <Query>/<Mutation>
  "react-apollo",
  "@apollo/react-components",
]);

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
     * Entries here are merged last and override that default.
     *
     * @see https://module-federation.io/configure/shared.html
     */
    shared?: Record<
      string,
      {
        name?: string;
        version?: string;
        shareScope?: string;
        singleton?: boolean;
        requiredVersion?: string;
        strictVersion?: boolean;
        import?: string | false;
      }
    >;
  } & Omit<ModuleFederationOptions, "name" | "filename" | "exposes" | "shared">,
): Plugin[] {
  const {
    name,
    dependencies = {},
    peerDependencies = {},
    jahia = {},
  } = readPackageJson();

  // Unless explicitly specified, use the package name as the federation module name
  options.name ??= name;

  if (!options.name) {
    throw new Error("Federation module name is not defined in options and package.json.");
  }

  const misdeclared = Object.keys(dependencies).filter((d) => hostSingletons.has(d));
  if (misdeclared.length > 0) {
    throw new Error(
      "The following libraries are provided by the host as singletons and must be declared in `peerDependencies`: " +
        misdeclared.join(", "),
    );
  }

  const notProvided = Object.keys(peerDependencies).filter((d) => !hostSingletons.has(d));
  if (notProvided.length > 0) {
    throw new Error(
      "The following libraries are declared in `peerDependencies` but are not provided by the host as singletons: " +
        notProvided.join(", "),
    );
  }

  const shared: Record<string, Record<string, unknown>> = {
    // Bundled in the remote, pooled with the other federated modules for deduplication
    ...mapDependencies(dependencies, (requiredVersion) => ({ requiredVersion })),
    // Imported from the host, never bundled
    ...mapDependencies(peerDependencies, (requiredVersion) => ({
      singleton: true,
      import: false,
      requiredVersion,
    })),
    ...options.shared,
  };

  // Subpath import is not automatic, configure common React subpaths
  if (shared.react) {
    shared["react/jsx-runtime"] ??= shared.react;
    shared["react/jsx-dev-runtime"] ??= shared.react;
  }
  if (shared["react-dom"]) {
    shared["react-dom/client"] ??= shared["react-dom"];
  }

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

/**
 * Ranges using a Yarn protocol (`workspace:^`, `npm:...`, `catalog:`, etc.) are not valid
 * SemVer, so they are dropped and Module Federation falls back to the installed version.
 */
function mapDependencies(
  dependencies: Record<string, string>,
  entry: (requiredVersion: string | undefined) => Record<string, unknown>,
) {
  return Object.fromEntries(
    Object.entries(dependencies).map(([dep, range]) => [
      dep,
      entry(range.includes(":") ? undefined : range),
    ]),
  );
}
