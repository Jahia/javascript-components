<h1 align="center">Welcome to Jahia JavaScript Monorepo 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/intuit/auto">
    <img src="https://camo.githubusercontent.com/ef8d9d752768e40279d415d31cd5d23b30dd0894/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656c656173652d6175746f2e7376673f636f6c6f72413d38383838383826636f6c6f72423d394230363541266c6162656c3d6175746f" alt="Auto Release" data-canonical-src="https://img.shields.io/badge/release-auto.svg?colorA=888888&amp;colorB=9B065A&amp;label=auto" style="max-width:100%;">
  </a>
  <a href="./LICENSE.txt" target="_blank">
    <img alt="License: JAHIA'S DUAL LICENSING" src="https://img.shields.io/badge/JAHIA'S DUAL LICENSING-yellow.svg" />
  </a>
  <a href="https://twitter.com/Jahia" target="_blank">
    <img alt="Twitter: Jahia" src="https://img.shields.io/twitter/follow/Jahia.svg?style=social" />
  </a>

</p>

> Monorepo of all front-end library of Jahia

## Projects

This project is composed of (click on the link for there documentation):

- [ui-extender - ⚗ - Allow Jahia module to extend Jahia UI](./packages/ui-extender)
- [data-helper - 💡- Provide helpers (react hooks, utily function, ...) to manipulate jahia datas](./packages/data-helper)

- [eslint-config - 🔧 - Jahia eslint configuration](./packages/eslint-config)
- [stylelint-config - 🔧 - Jahia stylelint configuration](./packages/stylelint-config)
- [test-framework - 🔧 - Jest + Enzyme configuration for Jahia needs](./packages/test-framework)
- [scripts - 🔧 - Jahia internal build script](./packages/scripts)

- [design-system-kit - 💩 - DEPRECATED use moonstone instead](./packages/design-system-kit)
- [react-material - 💩 - DEPRECATED use moonstone/ui-extender instead](./packages/react-material)
- [icons - 💩 - DEPRECATED use moonstone instead](./packages/icons)

## Installation

Each package in the javascript-components repository is published to the public npm registry and scoped with `@jahia`.
You can install any package with:

```sh
npm i @jahia/package-name
```

or with yarn : `yarn add @jahia/package-name`.

## Development

### Getting started

This monorepo uses Node and Yarn. The easiest way to install Node and Yarn is to use [mise install](https://mise.jdx.dev/).

Before starting developing, you have to install dependencies:

```sh
yarn
```

The you can start develop and test using.

```sh
yarn tdd
```

Make sure each file respect the eslint configuration.

### Working with yalc

Sometime, when you are working on a JavaScript-Component package, you want to directly test your package on the other project you are working on. Yalc is here to help you do that.

### Build

In order to build every package, in the root folder, run:

```sh
yarn build
```

The final build will reside in the `dist` subfolder of each package.

Modules can also be built independently by going to packages subfolder, and use `yarn build`.


### Publish

Publication is done automatically when merging the [release PR created by Chachalog](https://github.com/GauBen/chachalog).

## Author

👤 **Jahia Group**

* Website: https://www.jahia.com
* Twitter: [@Jahia](https://twitter.com/Jahia)
* Github: [@Jahia](https://github.com/Jahia)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://jira.jahia.org/).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Jahia Group](https://github.com/Jahia).<br />
This project use JAHIA'S DUAL LICENSING, see [LICENSE.txt file](./LICENSE.txt).

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
