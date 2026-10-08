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

Builds now define `globalThis.__DEV__`, which Apollo Client 3.8+ requires to be explicitly `false` before it disables its dev-only behavior (deep-freezing cache results, verbose invariant messages).
