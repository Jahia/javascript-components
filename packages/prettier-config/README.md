<h1 align="center">Welcome to @jahia/prettier-config 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/jahia" target="_blank">
    <img alt="Twitter: jahia" src="https://img.shields.io/twitter/follow/jahia.svg?style=social" />
  </a>
</p>

> A Jahia Prettier shareable config to format JavaScript projects.

## Install

```sh
yarn add -D @jahia/prettier-config
```

## Configuration

Add the following line to your `package.json`:
```
"prettier": "@jahia/prettier-config"
```

You can also add the following scripts in your `package.json`:
```
{
    "prettier:fix": "prettier --write '{src}/**/*.{js,jsx,css,scss}'",
    "prettier": "prettier --check '{src}/**/*.{js,jsx,css,scss}'"
}
```

## Usage

```sh
yarn prettier
```

## Author

👤 **Jahia**

* Website: https://www.jahia.com
* Twitter: [@jahia](https://twitter.com/jahia)
* Github: [@jahia](https://github.com/jahia)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
