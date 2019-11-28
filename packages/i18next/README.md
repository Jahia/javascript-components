<h1 align="center">Welcome to @jahia/i18next 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="../../LICENSE.txt" target="_blank">
    <img alt="License: JAHIA'S DUAL LICENSING" src="https://img.shields.io/badge/License-JAHIA'S DUAL LICENSING-yellow.svg" />
  </a>
  <a href="https://twitter.com/Jahia" target="_blank">
    <img alt="Twitter: Jahia" src="https://img.shields.io/twitter/follow/Jahia.svg?style=social" />
  </a>
</p>

> Provides an i18next configuration

i18n support is brought by the [i18next library](https://www.i18next.com/).

## Install

```sh
yarn add @jahia/i18next
```

## Usage

- i18n file is a JSON file format
- i18n files are stored in `main/resources/javascript/locales`
- file name is `<locale>.json` where `locale` is `en`, `de`, `FR_fr`, etc ..

You have to set your React DX application as i18n in our main class wrapper `<I18nextProvider />`

```jsx
import {getI18n} from '@jahia/i18next'

<I18nextProvider
  i18n={getI18n({
    lng:props.dxContext.uilang,
    contextPath:props.dxContext.contextPath,
    ns: ['site-settings-seo', 'react-dxcomponents'],
    defaultNS: 'site-settings-seo', getData:getI18NData}
  )}
>
    <MyCustomComponent {...props} />
</I18nextProvider>
```

Note that `MyCustomComponent` declaration must precede wrapping the component with `DxContextProvider`.

In order to use i18n with the `MyCustomComponent`, you need to wrap it with the translation component (HOC pattern). This will add the `t` function to the `props` of the component, to be used to get a translated value by a key defined in the `<locale>.json` file:

```jsx
const MyCmp = ({t}) => (<p>{t('translate-key')}</p>)

const MyComponent = translate('<moduleName>')(MyCmp);
```

where `moduleName` is the artifact ID of the module.


## Author

👤 **Jahia**

* Jahia: [https://jahia.com](https://jahia.com)
* Twitter: [@Jahia](https://twitter.com/Jahia)
* Github: [@Jahia](https://github.com/Jahia)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://jira.jahia.org/).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Jahia](https://github.com/Jahia).<br />
This project is [JAHIA'S DUAL LICENSING](../../LICENSE.txt) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
