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
"@jahia/vite-federation-plugin": patch
# "@jahia/webpack-config": minor
---

The emitted `remoteEntry.js` now registers the module under the `name` option instead of always using the package.json name.
