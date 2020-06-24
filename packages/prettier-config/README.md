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

### Editor Configuration for Auto-Formatting

#### IntelliJ (JetBrains IDEs version 2020.1+)
1. Install the Prettier plugin: https://plugins.jetbrains.com/plugin/10456-prettier
2. Go to Preferences > Languages & Frameworks > JavaScript > Prettier and turn on `Run on save for files`
3. Add css and scss to the default pattern: `{**/*,*}.{js,ts,jsx,tsx,css,scss}`
4. Optionally, you may configure Prettier to run automatically on save in new projects: Go to File > New Projects Settings > Settings for New Projects. Then go to Languages & Frameworks > JavaScript > Prettier, select `Run on save files`, and update the pattern as above. 

#### VS Code
1. Install the Prettier extension: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
2. In the settings, choose `esbenp.prettier-vscode` as the `Editor: Default Formatter` and turn on `Editor: Format On Save`.

## Usage

If you added the scripts above to your `package.json` file, you can check whether your files need to be formatted with:
```sh
yarn prettier
```

Or, you can run the prettier formatting with:
```sh
yarn prettier:fix
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
