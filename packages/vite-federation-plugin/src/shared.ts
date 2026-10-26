/**
 * Libraries the federation host (the app-shell) provides as singletons.
 *
 * @see https://github.com/Jahia/gautier-braindump/issues/71
 */
export const hostSingletons = new Set([
  "react",
  "react-dom",
  "react-router",
  "react-router-dom-v5-compat",
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

/** @see https://module-federation.io/configure/shared.html */
export interface SharedConfig {
  name?: string;
  version?: string;
  shareScope?: string;
  singleton?: boolean;
  requiredVersion?: string;
  strictVersion?: boolean;
  import?: string | false;
}

/**
 * Derives the module federation `shared` option from the package.json:
 *
 * - `peerDependencies` are shared as singletons and imported from the host.
 * - `dependencies` are bundled in the remote and shared pooled.
 *
 * Throws if a library is in the wrong bucket. Libraries configured explicitly in `overrides`
 * skip these checks, which allows targeting a host this plugin does not know yet.
 */
export function getShared(
  {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
  }: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  },
  overrides: Record<string, SharedConfig> = {}
): Record<string, SharedConfig> {
  const misdeclared = Object.keys(dependencies).filter(
    (d) => hostSingletons.has(d) && !(d in overrides)
  );
  if (misdeclared.length > 0) {
    throw new Error(
      "The following libraries are provided by the host as singletons, move them from `dependencies` to `peerDependencies`: " +
        misdeclared.join(", ")
    );
  }

  // Keeping a host singleton in `devDependencies` is fine (Yarn does not install a workspace's
  // own peers), as long as it is also declared in `peerDependencies`
  const devOnly = Object.keys(devDependencies).filter(
    (d) => hostSingletons.has(d) && !(d in peerDependencies) && !(d in overrides)
  );
  if (devOnly.length > 0) {
    throw new Error(
      "The following libraries are provided by the host as singletons, add them to `peerDependencies`: " +
        devOnly.join(", ")
    );
  }

  const notProvided = Object.keys(peerDependencies).filter(
    (d) => !hostSingletons.has(d) && !(d in overrides)
  );
  if (notProvided.length > 0) {
    throw new Error(
      "The following libraries are not provided by the host as singletons, move them from `peerDependencies` to `dependencies` or `devDependencies`: " +
        notProvided.join(", ")
    );
  }

  const shared: Record<string, SharedConfig> = {
    // Bundled in the remote, pooled with the other federated modules for deduplication
    ...mapDependencies(dependencies, {}),
    // Imported from the host, never bundled
    ...mapDependencies(peerDependencies, { singleton: true, import: false }),
    ...overrides,
  };

  // Subpath import is not automatic, configure common React subpaths
  if (shared.react) {
    shared["react/jsx-runtime"] ??= shared.react;
    shared["react/jsx-dev-runtime"] ??= shared.react;
  }
  if (shared["react-dom"]) {
    shared["react-dom/client"] ??= shared["react-dom"];
  }

  return shared;
}

/**
 * Ranges using a Yarn protocol (`workspace:^`, `npm:...`, `catalog:`, etc.) are not valid
 * SemVer, so they are dropped and Module Federation falls back to the installed version.
 */
function mapDependencies(
  dependencies: Record<string, string>,
  config: SharedConfig
): Record<string, SharedConfig> {
  return Object.fromEntries(
    Object.entries(dependencies).map(([dep, range]) => [
      dep,
      range.includes(":")
        ? { ...config }
        : { ...config, requiredVersion: range },
    ])
  );
}
