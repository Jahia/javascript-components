# @jahia/vite-federation-plugin

This Vite plugin allows building Jahia UI extensions with a modern DX (developer experience).

We are still in the process of modernizing our documentation:

- [Jahia UI Extension First Steps](https://academy.jahia.com/documentation/jahia-cms/jahia-8.2/developer/extending-and-customizing-jahia-ui/first-steps)
- [Webpack to Vite migration guide](https://github.com/Jahia/app-shell/issues/377)

## Dependencies

The `package.json` of the module is the module federation manifest. Each library goes in one of three buckets:

- `peerDependencies`: libraries the host (the [app-shell](https://github.com/jahia/app-shell)) provides as singletons. They are imported from the host and never bundled in the module.
- `dependencies`: libraries bundled in the module and shared pooled, i.e. deduplicated with the other federated modules at runtime.
- `devDependencies`: libraries bundled and tree-shaken, and not shared at all. This is the right place for large libraries only a subset of which is used, e.g. `lodash`.

The libraries provided by the host as singletons are `react`, `react-dom`, `react-router`, `react-router-dom-v5-compat`, `react-redux`, `redux`, `i18next`, `react-i18next`, `formik`, `@jahia/ui-extender`, `react-apollo` and `@apollo/react-components`.

A library in the wrong bucket is a runtime bug, so the build fails with one of these errors:

- `` The following libraries are provided by the host as singletons, move them from `dependencies` to `peerDependencies`: ... ``
- `` The following libraries are provided by the host as singletons, add them to `peerDependencies`: ... `` (a host singleton may stay in `devDependencies`, e.g. for type checking, but must also be in `peerDependencies`)
- `` The following libraries are not provided by the host as singletons, move them from `peerDependencies` to `dependencies` or `devDependencies`: ... ``
