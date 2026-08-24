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

The package.json is now the module federation manifest: `peerDependencies` are shared as singletons, `dependencies` are bundled and shared pooled for deduplication, and `devDependencies` are bundled, tree-shaken and not shared.
