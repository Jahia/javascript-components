# Javascript components
The goal of this module is to provide multiple javascript [packages](https://github.com/Jahia/javascript-components/tree/master/packages) that can be reused in different javascript applications.

- reusable UI components
- context information like current node path, type, user, etc
- GraphQL connection
- i18n common configuration

## Usage
The packages are built and deployed to a private repository. Use the following command to configure your NPM install so that it 
can find the packages :

```npm login --registry=http://npm.int.jahia.com:4873 --scope=@jahia```

You should then be able to add a package with a simple `npm` or `yarn` command :

```yarn add @jahia/react-material```

When you make changes to javascript-components, a new beta (snapshot) version is built. You might want to update your dependency. 
For this purpose, in that project, update the library dependency using the same `yarn add` command, or a `yarn upgrade-interactive`
This will update the `yarn.lock` file you will have to commit.

## Build
Build is based on [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and [lerna](https://github.com/lerna/lerna). 
It won't work with npm, please only use yarn for building.

At root folder : 
- `yarn install` to install all dependencies
- `yarn build` to build all packages

Modules can be built independently by going to packages subfolder, and use `yarn build`. 

The final build will reside in the `build` subfolder of each package.

If you need to use `yarn link` to use your local build in another package, be sure to type `yarn link` inside the 
`build` folder, not the sources (package root) folder.

## Packages

### apollo-dx

Provides an apollo-client configured to connect on DX graphql API

### design-system-kit

Provides the Jahia Design System Theme for Matarial UI

### react-apollo

Provides helpers methods to manipulate DX nodes, based on graphQL api

### redux
Simple redux store with extensible reducers

### i18next
i18n support is brought by the [i18next library](https://www.i18next.com/). This package provides an i18next configuration.

- i18n file is a JSON file format
- i18n files are stored in `main/resources/javascript/locales`
- file name is `<locale>.json` where `locale` is `en`, `de`, `FR_fr`, etc ..

You have to set your React DX application as i18n in our main class wrapper `<I18nextProvider />`

```
import {getI18n} from '@jahia/i18next'

<I18nextProvider i18n={getI18n({lng:props.dxContext.uilang, contextPath:props.dxContext.contextPath, ns: ['site-settings-seo', 'react-dxcomponents'], defaultNS: 'site-settings-seo', getData:getI18NData})}>
    <MyCustomComponent {...props} />
</I18nextProvider>
```

Note that `MyCustomComponent` declaration must precede wrapping the component with `DxContextProvider`.

In order to use i18n with the `MyCustomComponent`, you need to wrap it with the translation component:

```
MyCustomComponent = translate('<moduleName>')(SeoSiteSettingsApp);

```
where `moduleName` is the artifact ID of the module.

This will add the `t` function to the `props` of the component, to be used to get a translated value by a key defined in the `<locale>.json` file:

```{props.t('label.title')}```


### react-material
We use the Material-UI library to build the UI: https://material-ui-next.com
`<LanguageSwitcher/>`: this component displays a language switcher and changes the locale value in the context as it is changed by the the user via the UI

### react-router
A router with multiple outlets - it allows to have multiple routes at the same time in the URL, each route applied to different outlets in the page.

### [test-framework](packages/test-framework)

Provides common dependencies, configuration, utilities and mocks for testing JavaScript projects.
 
### [@jahia/eslint-config](packages/eslint-config)

Provide Jahia ESLint shareable config to lint your JS projects.
