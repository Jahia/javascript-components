# @jahia/vite-federation-plugin Changelog

## 0.2.0

### New Features

* **Breaking:** the package.json is now the module federation manifest: `peerDependencies` are shared as singletons imported from the host, `dependencies` are bundled and shared pooled for deduplication, and `devDependencies` are bundled, tree-shaken and not shared. Previous versions shared every `dependencies` entry as a singleton and ignored `peerDependencies`.

  The build fails when a library provided by the host is declared in `dependencies`, or when a library not provided by the host is declared in `peerDependencies`; libraries configured explicitly with the `shared` option skip these checks. See the README for the list of host singletons.

  Vite `^8.2.0` is now required.

### Bug Fixes

* Builds now define `globalThis.__DEV__`, which Apollo Client 3.8+ requires to be explicitly `false` before it disables its dev-only behavior (deep-freezing cache results, verbose invariant messages).

* The emitted `remoteEntry.js` now registers the module under the `name` option instead of always using the package.json name.

## 0.1.3

* Disabled `.d.ts` production, updated ckeditor5 remote name.

## 0.1.2

* Fixed types from `@module-federation/vite`. (#371)

## 0.1.1

* Merge `jahia` key from source package.json to emitted dist/package.json (#347)

## 0.1.0

Initial release.
