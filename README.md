<h1 align="center">Welcome to Jahia JavaScript Monorepo 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
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

- [design-system-kit - 💩 - DEPRECATED use moonstone instead](./packages/design-system-kit)
- [react-material - 💩 - DEPRECATED use moonstone/ui-extender instead](./packages/react-material)
- [icons - 💩 - DEPRECATED use moonstone instead](./packages/icons)

- [ui-extender - ⚗ - Allow Jahia module to extend Jahia UI](./packages/ui-extender)

- [eslint-config - 🔧 - Jahia eslint configuration](./packages/eslint-config)
- [stylelint-config - 🔧 - Jahia stylelint configuration](./packages/stylelint-config)
- [test-framework - 🔧 - Jest + Enzyme configuration for Jahia needs](./packages/test-framework)
- [scripts - 🔧 - Jahia internal build script](./packages/scripts)


- [apollo-dx - 🚀 - Provides an apollo-client configured to connect on DX graphql API](./packages/apollo-dx)
- [react-apollo - 🚀 - Provides helpers methods to manipulate DX nodes, based on graphQL API](./packages/react-apollo)
- [i18next - 🌐 - Provides an i18next configuration](./packages/i18next)
- [react-router - ✨ - A router with multiple outlets](./packages/react-router)
- [redux - 💩 - DEPRECATED no one use it](./packages/redux)


## Installation

Jahia use his own npm server, so you have to tell to yarn and npm CLI where to find dependency. In order to achieve that, create a `.npmrc` file and copy past the code below in it.

```
@jahia:registry=https://npm.jahia.com
```

Each project are deployed on to a private repository and scoped with `@jahia`.
You can install any package with:

```sh
npm i @jahia/package-name
```

or with yarn : `yarn add @jahia/package-name`.

## Development

### Getting started

We are using Yarn for each project at Jahia and in this project specially the [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) feature. You can install *yarn* with `npm i -g yarn`.
It won't work with npm, please only use yarn for building.

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

The final build will reside in the `build` subfolder of each package.

Modules can also be built independently by going to packages subfolder, and use `yarn build`.


### Publish

When you make changes to javascript-components, a new beta (snapshot) version is built and published automatically.


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
