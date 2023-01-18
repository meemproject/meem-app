## The Meem Web App

Hello there and welcome! If you're reading this, you've discovered the front end for the [Meem app](https://app.meem.wtf)! The Meem app is open source and released under the MIT license. In addition, we have gone to some lengths to make it as extensible as possible.

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

### Building on Meem with Extensions

We have created an 'Extension' architecture which makes it easy for developers to integrate their own platforms, services and tooling into Meem so that every community can be served in the specific ways they need. Within this architecture, you are able to easily do the following:

-   Build your own widget for community homepages
-   Build a 'homepage' for your platform, service, content or tooling within Meem
-   Build custom settings that allow community organizers to manage the extension
-   Integrate with and extend the Meem SDK to make your extension discoverable and easy to enable
-   Use the Meem SDK to access club-level data such as contract addresses, members and more.

### The structure of an Extension

Each Meem Extension looks like this:

-   A subfolder within `components/Extensions` containing the Extension widget, homepage and settings components
-   A small modification to `AgreementHome` to display the correct Extension widget if the community has enabled it
-   A subfolder inside `pages/[slug]/e/` containing the Extension's pages on the Meem app
-   An entry in our database to make the extension discoverable and accessible (containing Extension metadata like title, icon and description)

An example Extension can be found in the above locations. Feel free to duplicate these files and use them as a base for your own Extensions.

### Getting started building an extension

We have created a convenient starter script which auto-generates the required files for extension code. From the root directory, run `yarn createExtension` and follow the instructions. From there, building an extension generally follows the following pattern:

- Writing code in the provided extension files
- Adding a light and dark mode icon (ideally 64x64px png or larger) to represent the extension (follow the pattern `integration-[extension-slug].png`, appending `-white` at the end for dark mode, e.g. `integration-discord.png` and `integration-discord-white.png`)
- Requesting an entry in our extensions database with extension name, description and icon name
- Creating a PR and having it be reviewed and approved.
- 
### Extension etiquette and submission process

-   The folders above are reserved for Extensions only. If you need to make use of other Meem features, please let us know how we can enable these in the SDK.
-   Please don't build Extension code outside of the Extension folders.
-   Create a PR containing the entire code for your Extension.
-   Please make use of the existing Meem theme (see above) when implementing the widget for your Extension. Do not create an overly spacious or distinct visual style here. Use the 'official' club widgets as guidelines. (We're more flexible with your Extension homepage!)
-   Be mindful of what you do with club member data. It goes without saying, but we're not going to approve and merge unethical or illegal code.
-   We'll promptly review your Extension PR and work closely with you to ensure your extension gets enabled and merged into the core Meem codebase.

### Further questions?

Don't hesitate to talk to us in Discord!
