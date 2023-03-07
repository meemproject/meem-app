## The Meem Web App

Hello there and welcome! If you're reading this, you've discovered the front end for the [Meem app](https://app.meem.wtf)! The Meem app is open source and released under the MIT license. In addition, we have gone to some lengths to make it as extensible as possible. You can find full documentation on the Meem Protocol and more on our [GitBook site](https://docs.meem.wtf/meem-protocol/).

### Our stack

The Meem web app uses the following main external dependencies (among others):

-   [NextJS](https://nextjs.org/)
-   [Mantine](https://mantine.dev/) (UI components library)
-   [Apollo GraphQL](https://github.com/apollographql/apollo-client)
-   [Meem SDK API package](https://www.npmjs.com/package/@meemproject/api)
-   [Meem SDK React package](https://www.npmjs.com/package/@meemproject/react)
-   [Meem SDK Contracts package](https://www.npmjs.com/package/@meemproject/contracts)

### Supported chains

The Meem SDK currently supports the following Ethereum chains:

-   Polygon (primary)
-   Optimism
-   Arbitrum
-   Mumbai Testnet
-   Goerli Testnet
-   Arbitrum Goerli Testnet
-   Optimism Goerli Testnet

### Getting started

1. Download this repository using the `git` client of your choice
2. In the root directory, run `yarn` to install dependencies
3. Copy `.env.example` and rename it to `.env`
4. Obtain an Alchemy API key and RPC URLs (or contact us to use ours!), then add them to the `.env` file
5. Run `yarn local` to run the app
6. Access the app at [http://localhost:3001](http://localhost:3001)

### Project structure

The Meem web app is currently structured as follows:

-   The `components` folder contains React Functional Components that make up the contents of Meem pages.
-   Within the `components` folder, you'll find distinct subfolders for the `Home`, `AgreementHome`, `Admin`, `Roles`, `Profile`, `Create`, `Authenticate`, `Extensions` and other page content.
-   Also within the `components` folder, you'll find the `MeemTheme` file, containing standard CSS styles and colors used by all components in Meem. You can make use of the MeemTheme by adding `const { classes: meemTheme } = useMeemTheme()` at the top of your component and adding `className={meemTheme.<style>}` inside the relevant JSX component.
-   The `model` folder contains view models for various parts of the Meem GraphQL API that either require local processing (i.e. looking up tokens) or are not yet convenient enough to be a 1:1 fit for the frontend. We are working on eventually removing the need for these models entirely, but you may lean on them as needed for now.
-   The `pages` folder, conforming to NextJS's site file/folder structure, contains the various site pages, each of which containing page meta tags and in some cases Server Side Prop fetching (for example, fetching the community's name and updating the site title, or fetching a page preview image).
-   The site as a whole makes use of several `Provider` classes, many of which are part of the Meem React SDK. Using these providers allows you to easily retrieve user identites, club data or make queries to GraphQL directly. You can find usages of these providers in `_app.tsx` and elsewhere.

### Making changes

You're, of course, free to do whatever you like with this code under the terms of the MIT license. However, if you'd like to contribute to the project, just open a PR with your changes and we'll take a look right away. Contributions of any kind are welcome!

### Documentation

View our full documentation [here](https://docs.meem.wtf/meem-protocol/)

### Further questions?

Don't hesitate to talk to us in Discord!
