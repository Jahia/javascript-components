---
# Allowed version bumps: patch, minor, major
# "@jahia/data-helper": minor
# "@jahia/design-system-kit": minor
# "@jahia/eslint-config": minor
# "@jahia/icons": minor
# "@jahia/react-material": minor
# "@jahia/scripts": minor
# "@jahia/stylelint-config": minor
# "@jahia/test-framework": minor
# "@jahia/ui-extender": minor
"@jahia/vite-federation-plugin": minor
# "@jahia/webpack-config": minor
---

**Breaking:** the package.json is now the module federation manifest: `peerDependencies` are shared as singletons imported from the host, `dependencies` are bundled and shared pooled for deduplication, and `devDependencies` are bundled, tree-shaken and not shared. Previous versions shared every `dependencies` entry as a singleton and ignored `peerDependencies`.

The build fails when a library provided by the host is declared in `dependencies`, or when a library not provided by the host is declared in `peerDependencies`; libraries configured explicitly with the `shared` option skip these checks. See the README for the list of host singletons.

Vite `^8.2.0` is now required.
