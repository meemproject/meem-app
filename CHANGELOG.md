## [1.28.3](https://github.com/meemproject/meem-app/compare/v1.28.2...v1.28.3) (2023-04-10)

## [1.28.2](https://github.com/meemproject/meem-app/compare/v1.28.1...v1.28.2) (2023-04-10)

## [1.28.1](https://github.com/meemproject/meem-app/compare/v1.28.0...v1.28.1) (2023-04-10)

# [1.28.0](https://github.com/meemproject/meem-app/compare/v1.27.2...v1.28.0) (2023-03-29)


### Bug Fixes

* allow localhost urls in symphony webhooks ([8ea24d9](https://github.com/meemproject/meem-app/commit/8ea24d9))
* cleanup rules visibility for non-members ([096a2ab](https://github.com/meemproject/meem-app/commit/096a2ab))
* create a synthetic output for webhook rules so they behave consistently in the ui ([5023e18](https://github.com/meemproject/meem-app/commit/5023e18))
* design QA on connections modal + symphony settings page ([2c2527c](https://github.com/meemproject/meem-app/commit/2c2527c))
* disconnection modal not showing up ([87c0b5f](https://github.com/meemproject/meem-app/commit/87c0b5f))
* display of webhook based rules (discord inputs only currently(?)), display of agr. homepage ([5c4dc04](https://github.com/meemproject/meem-app/commit/5c4dc04))
* generate uuid private key, show private key + url again in symphony rule builders / IO modal ([27d62c5](https://github.com/meemproject/meem-app/commit/27d62c5))
* issue where private key updates on each re-draw + unnecessary roles section in slack input component ([0102798](https://github.com/meemproject/meem-app/commit/0102798))
* members can now view agreements that have not launched yet ([a2a6aa4](https://github.com/meemproject/meem-app/commit/a2a6aa4))
* optimize png asset size ([d2b232c](https://github.com/meemproject/meem-app/commit/d2b232c))
* remove references to ethdenver, upgrade packages ([af345d4](https://github.com/meemproject/meem-app/commit/af345d4))
* use private key for existing rule ([9230879](https://github.com/meemproject/meem-app/commit/9230879))
* when either slack channel or workspace data is not found, show an error message. ([5866da4](https://github.com/meemproject/meem-app/commit/5866da4))


### Features

* chain agnosticism ([bbb6ae5](https://github.com/meemproject/meem-app/commit/bbb6ae5))

## [1.27.2](https://github.com/meemproject/meem-app/compare/v1.27.1...v1.27.2) (2023-02-28)

## [1.27.1](https://github.com/meemproject/meem-app/compare/v1.27.0...v1.27.1) (2023-02-24)


### Bug Fixes

* agreement slug in og preview, provide a way to sign in again if agreement error ([7b5088b](https://github.com/meemproject/meem-app/commit/7b5088b))

# [1.27.0](https://github.com/meemproject/meem-app/compare/v1.26.0...v1.27.0) (2023-02-24)


### Bug Fixes

* attempt to fix og tags using a more failsafe way to get the current slug ([9dd48f8](https://github.com/meemproject/meem-app/commit/9dd48f8))
* display of text in communityTweets ext for non-admins when there are no communityTweets rules ([fe7ee8f](https://github.com/meemproject/meem-app/commit/fe7ee8f))


### Features

* meem promo content on homepage for signed out users ([a12bfe2](https://github.com/meemproject/meem-app/commit/a12bfe2))

# [1.26.0](https://github.com/meemproject/meem-app/compare/v1.25.0...v1.26.0) (2023-02-24)


### Bug Fixes

* hide 'under construction' message if viewing meem homepage and not a member of the community ([600d494](https://github.com/meemproject/meem-app/commit/600d494))
* reconnect discord event ([8f94cde](https://github.com/meemproject/meem-app/commit/8f94cde))


### Features

* much faster page load times by removing GetServerSideProps, update site og description and standardize page title naming convention ([4ec321c](https://github.com/meemproject/meem-app/commit/4ec321c))
* responsive modals throughout the site ([c2b0de0](https://github.com/meemproject/meem-app/commit/c2b0de0))

# [1.25.0](https://github.com/meemproject/meem-app/compare/v1.24.1...v1.25.0) (2023-02-23)


### Bug Fixes

* Allow community members to view unpublished communities, update copy ([cc8219e](https://github.com/meemproject/meem-app/commit/cc8219e))
* update publish copy ([784ccea](https://github.com/meemproject/meem-app/commit/784ccea))


### Features

* createExtension script is updated to support new extensions structure, updated example files, fixed some issues with ExtensionBlankSlate ([cc13f7e](https://github.com/meemproject/meem-app/commit/cc13f7e))

## [1.24.1](https://github.com/meemproject/meem-app/compare/v1.24.0...v1.24.1) (2023-02-23)


### Bug Fixes

* add meem logo to sign in page ([9bb5b00](https://github.com/meemproject/meem-app/commit/9bb5b00))
* agreement join button doesn't work if not signed in, excess padding on mobile auth screen ([3d15d88](https://github.com/meemproject/meem-app/commit/3d15d88))
* hide metamask option on mobile ([13222e7](https://github.com/meemproject/meem-app/commit/13222e7))
* improve handling of switch network dialog on mobile ([579ac6a](https://github.com/meemproject/meem-app/commit/579ac6a))
* mobile only layout includes 'browser wallet' for brave browser etc ([62df732](https://github.com/meemproject/meem-app/commit/62df732))
* move 'setup complete' analytics event to button event to prevent duplicates ([655ba5f](https://github.com/meemproject/meem-app/commit/655ba5f))
* padding issue ([326ba66](https://github.com/meemproject/meem-app/commit/326ba66))
* responsive 'faq' modal ([e5db7c4](https://github.com/meemproject/meem-app/commit/e5db7c4))
* switch network modal is now responsive ([c7d902d](https://github.com/meemproject/meem-app/commit/c7d902d))
* temporarily move login form into meem-app to fix dark mode issues for now ([8369e53](https://github.com/meemproject/meem-app/commit/8369e53))
* unnecessary loading state when creating an agreement in symph onboarding flow, padding on 'add extension' widget ([ac38486](https://github.com/meemproject/meem-app/commit/ac38486))

# [1.24.0](https://github.com/meemproject/meem-app/compare/v1.23.4...v1.24.0) (2023-02-22)


### Bug Fixes

* better handling of mobile on community homepage ([1bf5ead](https://github.com/meemproject/meem-app/commit/1bf5ead))
* case-sensitive search throughout the site ([c3256fb](https://github.com/meemproject/meem-app/commit/c3256fb))
* creating agreement copy ([9dc36a5](https://github.com/meemproject/meem-app/commit/9dc36a5))
* dark mode colors for extensions widget containers ([4cb7125](https://github.com/meemproject/meem-app/commit/4cb7125))
* enable extensions with widgets by default ([c12ac18](https://github.com/meemproject/meem-app/commit/c12ac18))
* further extension cleanup + theme fixes ([312b4d1](https://github.com/meemproject/meem-app/commit/312b4d1))
* handle an edge case where existing community picker grid was squashed on large screen sizes ([8efba13](https://github.com/meemproject/meem-app/commit/8efba13))
* linkify header external links ([627fac9](https://github.com/meemproject/meem-app/commit/627fac9))
* links can now be right-clicked / opened in new tabs ([8fbadc7](https://github.com/meemproject/meem-app/commit/8fbadc7))
* loading state during creating community ([e6041cf](https://github.com/meemproject/meem-app/commit/e6041cf))
* make it a little easier to choose a role from the role admin page ([50a6e60](https://github.com/meemproject/meem-app/commit/50a6e60))
* make sure some external links open in a new tab ([5ccced9](https://github.com/meemproject/meem-app/commit/5ccced9))
* meem logo in header now links to meem website homepage ([b38926e](https://github.com/meemproject/meem-app/commit/b38926e))
* nav bar visible above modals + switch network dialog ([55c6564](https://github.com/meemproject/meem-app/commit/55c6564))
* only show 'connected' state in communityTweets settings if guildId !== null ([5fc3f8a](https://github.com/meemproject/meem-app/commit/5fc3f8a))
* Refactor authentication to use cookies rather than return query (more reliable) ([7005f7b](https://github.com/meemproject/meem-app/commit/7005f7b))
* remove 'all' as option for selecting channels ([f804cbd](https://github.com/meemproject/meem-app/commit/f804cbd))
* remove onboarding state from communityTweets settings page ([50ee094](https://github.com/meemproject/meem-app/commit/50ee094))
* responsive extension settings modal ([f66fca1](https://github.com/meemproject/meem-app/commit/f66fca1))
* selected extensions check icon ([0cf5f63](https://github.com/meemproject/meem-app/commit/0cf5f63))
* use a different calculation of what extensions are visible to the public ([4d9c708](https://github.com/meemproject/meem-app/commit/4d9c708))
* z-index issue when adding role members ([53266a1](https://github.com/meemproject/meem-app/commit/53266a1))


### Features

* add extensions modal, simplified logic and renamed ext related files for clarity ([7e265b8](https://github.com/meemproject/meem-app/commit/7e265b8))
* basic extension settings ([1457879](https://github.com/meemproject/meem-app/commit/1457879))
* combine steps 3 and 4 of onboarding ([56fafcf](https://github.com/meemproject/meem-app/commit/56fafcf))
* discussions and guild using new widget architecture ([90f079e](https://github.com/meemproject/meem-app/commit/90f079e))
* expandable widget accordion container, useful for all extension widgets ([c69f1cd](https://github.com/meemproject/meem-app/commit/c69f1cd))
* handle reconnecting discord from the communityTweets settings page ([d6a7c30](https://github.com/meemproject/meem-app/commit/d6a7c30))
* hide extension settings access for non-admins ([6d23bd2](https://github.com/meemproject/meem-app/commit/6d23bd2))
* hide some widget content for non-members / non-admins ([01f45f5](https://github.com/meemproject/meem-app/commit/01f45f5))
* hide communityTweets settings from community members, hide communityTweets rules from non members ([6729d33](https://github.com/meemproject/meem-app/commit/6729d33))
* onboarding sidebar ([016281a](https://github.com/meemproject/meem-app/commit/016281a))
* refactor communityTweets onboarding agreement creation to use internal logic, revert modals to original state (no quiet mode) ([f5b3c29](https://github.com/meemproject/meem-app/commit/f5b3c29))
* remember expanded / collapsed state of every widget for every community ([2c6bf78](https://github.com/meemproject/meem-app/commit/2c6bf78))
* remove all support for link extensions ([fd5daa6](https://github.com/meemproject/meem-app/commit/fd5daa6))
* remove extension settings from admin page ([ce90862](https://github.com/meemproject/meem-app/commit/ce90862))
* responsive communityTweets settings + rules ([c5f12ed](https://github.com/meemproject/meem-app/commit/c5f12ed))
* single-page communityTweets onboarding ([4ef440d](https://github.com/meemproject/meem-app/commit/4ef440d))
* switch network screen is now a modal ([d1daddc](https://github.com/meemproject/meem-app/commit/d1daddc))
* communityTweets extension settings now extracted into its own component ([5616142](https://github.com/meemproject/meem-app/commit/5616142))

## [1.23.4](https://github.com/meemproject/meem-app/compare/v1.23.3...v1.23.4) (2023-02-14)

## [1.23.3](https://github.com/meemproject/meem-app/compare/v1.23.2...v1.23.3) (2023-02-14)

## [1.23.2](https://github.com/meemproject/meem-app/compare/v1.23.1...v1.23.2) (2023-02-14)


### Bug Fixes

* Remove reference to easter egg ([c4f13eb](https://github.com/meemproject/meem-app/commit/c4f13eb))
* communityTweets sign in redirect flow ([1727b9c](https://github.com/meemproject/meem-app/commit/1727b9c))

## [1.23.1](https://github.com/meemproject/meem-app/compare/v1.23.0...v1.23.1) (2023-02-14)

# [1.23.0](https://github.com/meemproject/meem-app/compare/v1.22.4...v1.23.0) (2023-02-14)


### Bug Fixes

* another incorrect link placement ([f03402e](https://github.com/meemproject/meem-app/commit/f03402e))
* issue with ServerSideProps on NextJS 13 ([0f8d0a7](https://github.com/meemproject/meem-app/commit/0f8d0a7))
* next link in wrong place, extension link padding ([a6d25c8](https://github.com/meemproject/meem-app/commit/a6d25c8))


### Features

* react 18.2.0, nextjs 13 ([5442dce](https://github.com/meemproject/meem-app/commit/5442dce))

## [1.22.4](https://github.com/meemproject/meem-app/compare/v1.22.3...v1.22.4) (2023-02-13)


### Bug Fixes

* sign in design, typo ([a88618c](https://github.com/meemproject/meem-app/commit/a88618c))
* Update error copy to specify how to contact us ([7c2c3c1](https://github.com/meemproject/meem-app/commit/7c2c3c1))

## [1.22.3](https://github.com/meemproject/meem-app/compare/v1.22.2...v1.22.3) (2023-02-12)


### Bug Fixes

* loader position ([c4032c0](https://github.com/meemproject/meem-app/commit/c4032c0))

## [1.22.2](https://github.com/meemproject/meem-app/compare/v1.22.1...v1.22.2) (2023-02-12)

## [1.22.1](https://github.com/meemproject/meem-app/compare/v1.22.0...v1.22.1) (2023-02-10)

# [1.22.0](https://github.com/meemproject/meem-app/compare/v1.21.0...v1.22.0) (2023-02-10)


### Bug Fixes

* make communityTweets exit button clickable ([7f1a18c](https://github.com/meemproject/meem-app/commit/7f1a18c))
* remove 'save changes' from communityTweets settings ([9ccaace](https://github.com/meemproject/meem-app/commit/9ccaace))
* robust redirect for communities with extensions already enabled ([463a49c](https://github.com/meemproject/meem-app/commit/463a49c))
* communityTweets loading now waits for all gun data to be available ([ba1789f](https://github.com/meemproject/meem-app/commit/ba1789f))


### Features

* better communityTweets widget ([0188348](https://github.com/meemproject/meem-app/commit/0188348))

# [1.21.0](https://github.com/meemproject/meem-app/compare/v1.20.0...v1.21.0) (2023-02-10)


### Bug Fixes

* onboarding steps ([d90cd8b](https://github.com/meemproject/meem-app/commit/d90cd8b))
* re-add tabler icon as they're a mantine dependency ([bb72d35](https://github.com/meemproject/meem-app/commit/bb72d35))
* refactor icons in the app to only use iconnoir ([86248a3](https://github.com/meemproject/meem-app/commit/86248a3))
* update copy in meem faq and communityTweets onboarding ([3f4d67c](https://github.com/meemproject/meem-app/commit/3f4d67c))


### Features

* modal for manage connection ([8cb5238](https://github.com/meemproject/meem-app/commit/8cb5238))
* slack connection w/ feature flag ([4fca8d9](https://github.com/meemproject/meem-app/commit/4fca8d9))

## [1.20.1](https://github.com/meemproject/meem-app/compare/v1.20.0...v1.20.1) (2023-02-09)


### Bug Fixes

* onboarding steps ([d90cd8b](https://github.com/meemproject/meem-app/commit/d90cd8b))
* re-add tabler icon as they're a mantine dependency ([bb72d35](https://github.com/meemproject/meem-app/commit/bb72d35))
* refactor icons in the app to only use iconnoir ([86248a3](https://github.com/meemproject/meem-app/commit/86248a3))
* update copy in meem faq and communityTweets onboarding ([3f4d67c](https://github.com/meemproject/meem-app/commit/3f4d67c))

# [1.20.0](https://github.com/meemproject/meem-app/compare/v1.19.3...v1.20.0) (2023-02-08)


### Bug Fixes

* another spot where error code could be null ([56ce0cc](https://github.com/meemproject/meem-app/commit/56ce0cc))
* if not logged in on extension pages requiring auth, redirect to login ([18a65a4](https://github.com/meemproject/meem-app/commit/18a65a4))
* remove signer + web3provider as reqs for parsing reqs ([7ce2500](https://github.com/meemproject/meem-app/commit/7ce2500))
* standardize jwt errors across the app, fix possible double forward slash error ([60e7533](https://github.com/meemproject/meem-app/commit/60e7533))


### Features

* onboarding banner in communityTweets settings ([3ab7fc1](https://github.com/meemproject/meem-app/commit/3ab7fc1))
* show warning when adding to gated discord channels ([83277bb](https://github.com/meemproject/meem-app/commit/83277bb))
* communityTweets widget for unlaunched communities ([a4b751d](https://github.com/meemproject/meem-app/commit/a4b751d))

## [1.19.3](https://github.com/meemproject/meem-app/compare/v1.19.2...v1.19.3) (2023-02-07)

## [1.19.2](https://github.com/meemproject/meem-app/compare/v1.19.1...v1.19.2) (2023-02-07)

## [1.19.1](https://github.com/meemproject/meem-app/compare/v1.19.0...v1.19.1) (2023-02-07)


### Bug Fixes

* click outside to close create agreement modal ([3e2685d](https://github.com/meemproject/meem-app/commit/3e2685d))

# [1.19.0](https://github.com/meemproject/meem-app/compare/v1.18.0...v1.19.0) (2023-02-07)


### Bug Fixes

* a couple bugs with role changes modal duplicating some actions ([e76b623](https://github.com/meemproject/meem-app/commit/e76b623))
* clicking outside of rule builder closes it ([1a84110](https://github.com/meemproject/meem-app/commit/1a84110))
* edge case with agreement provider where errors could cause an infinite loading state ([e6e4203](https://github.com/meemproject/meem-app/commit/e6e4203))


### Features

* enhanced communityTweets onboarding flow ([88f6737](https://github.com/meemproject/meem-app/commit/88f6737))
* extension setup / onboarding + community creation flow ([069f2e3](https://github.com/meemproject/meem-app/commit/069f2e3))

# [1.18.0](https://github.com/meemproject/meem-app/compare/v1.17.0...v1.18.0) (2023-02-06)


### Features

* agreement transactions (other than roles) are now handled in the background ([279f3bd](https://github.com/meemproject/meem-app/commit/279f3bd))
* support monitoring multiple tx passed into the provider ([e5ea87c](https://github.com/meemproject/meem-app/commit/e5ea87c))

# [1.17.0](https://github.com/meemproject/meem-app/compare/v1.16.1...v1.17.0) (2023-02-03)


### Bug Fixes

* app colors, discussion display name ([b8b5a2c](https://github.com/meemproject/meem-app/commit/b8b5a2c))
* widget margins on homepage ([9b3540b](https://github.com/meemproject/meem-app/commit/9b3540b))


### Features

* divider on homepage and couple mobile fixes ([ba59659](https://github.com/meemproject/meem-app/commit/ba59659))
* new ext picker UI w/ categories for blank slate ([45fa7b4](https://github.com/meemproject/meem-app/commit/45fa7b4))

## [1.16.1](https://github.com/meemproject/meem-app/compare/v1.16.0...v1.16.1) (2023-02-02)


### Bug Fixes

* twitter detection and bot activation ([266ee5a](https://github.com/meemproject/meem-app/commit/266ee5a))

# [1.16.0](https://github.com/meemproject/meem-app/compare/v1.15.1...v1.16.0) (2023-02-02)


### Bug Fixes

* another edge case with error.graphqlerrors ([11ecf62](https://github.com/meemproject/meem-app/commit/11ecf62))
* client side error when checking for an 'invalid-jwt' error ([3446708](https://github.com/meemproject/meem-app/commit/3446708))
* dark mode google icon ([3d2564c](https://github.com/meemproject/meem-app/commit/3d2564c))
* display of 'under construction' message ([390610a](https://github.com/meemproject/meem-app/commit/390610a))
* don't check membership requirements if wallet is not connected ([f054798](https://github.com/meemproject/meem-app/commit/f054798))
* edge case where if a community had no available widgets but had a link, the under construction message would show up ([15f1dde](https://github.com/meemproject/meem-app/commit/15f1dde))
* emoji picker not working in a couple spots on the site ([f6a3965](https://github.com/meemproject/meem-app/commit/f6a3965))
* get token balance, show loading state instead of join button if reqs are being checked ([60a4e60](https://github.com/meemproject/meem-app/commit/60a4e60))
* improve page loads by ~1.5 seconds by streaming in member-only data when ready rather than waiting for anon queries first ([deff5e8](https://github.com/meemproject/meem-app/commit/deff5e8))
* margins ([d9ed88c](https://github.com/meemproject/meem-app/commit/d9ed88c))
* only check for tx in remove member modal if opened ([cc5369f](https://github.com/meemproject/meem-app/commit/cc5369f))
* refactor steward to communityTweets ([36b801a](https://github.com/meemproject/meem-app/commit/36b801a))
* small edge case where loading an anonymous agreement could temporarily show 'this community does not exist' ([d8aa919](https://github.com/meemproject/meem-app/commit/d8aa919))
* small ui fixes, revert authenticate as it's being worked on ([56506f9](https://github.com/meemproject/meem-app/commit/56506f9))
* token polygonscan link fixed, also now opens correctly in new tab ([1bf6e4a](https://github.com/meemproject/meem-app/commit/1bf6e4a))


### Features

* magic link wallet link moved into user dropdown ([c0e9699](https://github.com/meemproject/meem-app/commit/c0e9699))
* remove members from community via hover card ([deff4e7](https://github.com/meemproject/meem-app/commit/deff4e7))
* communityTweets styles ([af0c876](https://github.com/meemproject/meem-app/commit/af0c876))

## [1.15.1](https://github.com/meemproject/meem-app/compare/v1.15.0...v1.15.1) (2023-01-27)


### Bug Fixes

* extension settings ([2441de2](https://github.com/meemproject/meem-app/commit/2441de2))

# [1.15.0](https://github.com/meemproject/meem-app/compare/v1.14.0...v1.15.0) (2023-01-27)


### Bug Fixes

* adding role members removes existing ones ([e8c9657](https://github.com/meemproject/meem-app/commit/e8c9657))
* dark mode ext. icons ([0ddffdf](https://github.com/meemproject/meem-app/commit/0ddffdf))
* don't fetch agreement metadata in GetServerSideProps (should save many kb for agreements with images) ([e36c280](https://github.com/meemproject/meem-app/commit/e36c280))
* don't show 'add your first extension' for admins if there is an extension added of any kind ([a14d072](https://github.com/meemproject/meem-app/commit/a14d072))
* extension header community icon also links back to homepage ([2a6f275](https://github.com/meemproject/meem-app/commit/2a6f275))
* forwardref warnings and margins ([4eb7369](https://github.com/meemproject/meem-app/commit/4eb7369))
* url now correctly updates when navigating between tabs ([f18fc2a](https://github.com/meemproject/meem-app/commit/f18fc2a))
* use Link instead of Router.push to speed up page navigation ([d6a4bb8](https://github.com/meemproject/meem-app/commit/d6a4bb8))


### Features

* clicking on the header image in settings pages takes you back to the community home page ([a3bf40a](https://github.com/meemproject/meem-app/commit/a3bf40a))
* new blank slate state handling for community homepage ([aa51e74](https://github.com/meemproject/meem-app/commit/aa51e74))
* Require extensions to have completed setup before displaying in the UI. ([25dd733](https://github.com/meemproject/meem-app/commit/25dd733))
* set 'setup complete' when certain conditions are met on extensions ([67de79e](https://github.com/meemproject/meem-app/commit/67de79e))
* when creating extensions, set 'is setup complete' to true automatically if setup is not required ([9da6b9f](https://github.com/meemproject/meem-app/commit/9da6b9f))
* working extension categories ([073717a](https://github.com/meemproject/meem-app/commit/073717a))

# [1.14.0](https://github.com/meemproject/meem-app/compare/v1.13.1...v1.14.0) (2023-01-26)


### Bug Fixes

* create agreement modal wasn't opening in some scenarios ([9904dc4](https://github.com/meemproject/meem-app/commit/9904dc4))
* don't print ext categories ([653cc3a](https://github.com/meemproject/meem-app/commit/653cc3a))
* missing icon for steward ([4d58927](https://github.com/meemproject/meem-app/commit/4d58927))
* Switch Agreement Admin Changes modal over to monitor transactions, like roles modal ([f8cc355](https://github.com/meemproject/meem-app/commit/f8cc355))
* Update copy in dev modal for agreement details ([fc83c38](https://github.com/meemproject/meem-app/commit/fc83c38))


### Features

* sort extensions in list by category ([0f18c6d](https://github.com/meemproject/meem-app/commit/0f18c6d))
* updated style for enabled extensions ([86962fb](https://github.com/meemproject/meem-app/commit/86962fb))

## [1.13.1](https://github.com/meemproject/meem-app/compare/v1.13.0...v1.13.1) (2023-01-25)

# [1.13.0](https://github.com/meemproject/meem-app/compare/v1.12.0...v1.13.0) (2023-01-24)


### Bug Fixes

* burning role tokens ([c65100d](https://github.com/meemproject/meem-app/commit/c65100d))


### Features

* both creating a safe and changing meem protocol permissions now wait for changes on the db ([3129d1c](https://github.com/meemproject/meem-app/commit/3129d1c))
* working role changes modal ([4868938](https://github.com/meemproject/meem-app/commit/4868938))

# [1.12.0](https://github.com/meemproject/meem-app/compare/v1.11.1...v1.12.0) (2023-01-19)


### Bug Fixes

* don't use 'add link' logic as it may not apply to non-link, non-widget extensions ([315d4a9](https://github.com/meemproject/meem-app/commit/315d4a9))


### Features

* added missing extensions back into the app ([42d853f](https://github.com/meemproject/meem-app/commit/42d853f))

## [1.11.1](https://github.com/meemproject/meem-app/compare/v1.11.0...v1.11.1) (2023-01-18)

# [1.11.0](https://github.com/meemproject/meem-app/compare/v1.10.0...v1.11.0) (2023-01-18)


### Bug Fixes

* a couple of bugs with RoleManager and navigation ([ccbf0e9](https://github.com/meemproject/meem-app/commit/ccbf0e9))
* add role ids into mint and burn ([39538b1](https://github.com/meemproject/meem-app/commit/39538b1))
* adding and removing role members ([1b07088](https://github.com/meemproject/meem-app/commit/1b07088))
* crash when link extension is not set up yet ([d2e148f](https://github.com/meemproject/meem-app/commit/d2e148f))
* Fix some dark mode colors ([b3d098e](https://github.com/meemproject/meem-app/commit/b3d098e))
* loading indicator on auth screen disappears too early ([2ecd019](https://github.com/meemproject/meem-app/commit/2ecd019))
* meem logo distortion on mobile, home layout padding fix ([0e4d2ea](https://github.com/meemproject/meem-app/commit/0e4d2ea))
* mint tokens on role creation ([60829da](https://github.com/meemproject/meem-app/commit/60829da))
* prevent flash of switch network screen ([18b6398](https://github.com/meemproject/meem-app/commit/18b6398))
* Remove obsolete properties on agreement model ([d6cf1a7](https://github.com/meemproject/meem-app/commit/d6cf1a7))
* some incorrect params in the example link extension / blank slate ([0fc41d2](https://github.com/meemproject/meem-app/commit/0fc41d2))


### Features

* Link Extension Settings, Discord Link now supported ([c08b482](https://github.com/meemproject/meem-app/commit/c08b482))
* support sidebar and favorites section link visibility ([92180e3](https://github.com/meemproject/meem-app/commit/92180e3))

# [1.10.0](https://github.com/meemproject/clubs-web/compare/v1.9.1...v1.10.0) (2023-01-12)


### Bug Fixes

* button colors on discussion widget ([bb4824e](https://github.com/meemproject/clubs-web/commit/bb4824e))
* Hide the back arrow on settings if the extension has no widget + redirect to /guild/settings when necessary ([fb9bc2a](https://github.com/meemproject/clubs-web/commit/fb9bc2a))
* Sort models alphabetically ([a5ed818](https://github.com/meemproject/clubs-web/commit/a5ed818))
* UI tweaks to progress / creation modals ([6937dad](https://github.com/meemproject/clubs-web/commit/6937dad))


### Features

* Add 'isLaunched' property and use it to conditionally show onboarding-related UI ([bbe2914](https://github.com/meemproject/clubs-web/commit/bbe2914))
* basic sort/search ([cd3d358](https://github.com/meemproject/clubs-web/commit/cd3d358))
* choose extensions to enable when onboarding ([c37e6fe](https://github.com/meemproject/clubs-web/commit/c37e6fe))
* implement isLaunched and the 'launch' api request ([ce4d391](https://github.com/meemproject/clubs-web/commit/ce4d391))
* link extensions settings now includes url field, plus general ext. related bug fixes ([25b0e1a](https://github.com/meemproject/clubs-web/commit/25b0e1a))
* magic link support ([3490787](https://github.com/meemproject/clubs-web/commit/3490787))
* New community creation flow ([3747815](https://github.com/meemproject/clubs-web/commit/3747815))
* Show community create widget when you're a member of the meem community ([67af651](https://github.com/meemproject/clubs-web/commit/67af651))

## [1.9.1](https://github.com/meemproject/clubs-web/compare/v1.9.0...v1.9.1) (2023-01-06)

# [1.9.0](https://github.com/meemproject/clubs-web/compare/v1.8.1...v1.9.0) (2023-01-06)


### Features

* convert discussions to new storage method ([5d40edf](https://github.com/meemproject/clubs-web/commit/5d40edf))

## [1.8.1](https://github.com/meemproject/clubs-web/compare/v1.8.0...v1.8.1) (2022-12-23)

# [1.8.0](https://github.com/meemproject/clubs-web/compare/v1.7.3...v1.8.0) (2022-12-23)


### Bug Fixes

* chainId should come from useAuth instead of env vars ([c2a92ce](https://github.com/meemproject/clubs-web/commit/c2a92ce))
* missing client for subscriptions ([2ca2475](https://github.com/meemproject/clubs-web/commit/2ca2475))
* my clubs ([a5c3e4c](https://github.com/meemproject/clubs-web/commit/a5c3e4c))
* race condition for sdk.id.getLitAuthSig ([9b7a975](https://github.com/meemproject/clubs-web/commit/9b7a975))


### Features

* comment count on discussion post page; reload data after comment ([df8602a](https://github.com/meemproject/clubs-web/commit/df8602a))
* custom apollo provider to set hasura role in connectionParams ([1fbe8e6](https://github.com/meemproject/clubs-web/commit/1fbe8e6))
* discussion comments ([931f689](https://github.com/meemproject/clubs-web/commit/931f689))
* hooking up discussion reactions and votes ([89c3f16](https://github.com/meemproject/clubs-web/commit/89c3f16))
* implement hasura permissions; update to latest walletContext to fix several issues ([d7c775b](https://github.com/meemproject/clubs-web/commit/d7c775b))
* multi-chain support ([9e8d73d](https://github.com/meemproject/clubs-web/commit/9e8d73d))


### Refactoring

* part 2 ([9adddc9](https://github.com/meemproject/clubs-web/commit/9adddc9))

## [1.7.3](https://github.com/meemproject/clubs-web/compare/v1.7.2...v1.7.3) (2022-09-21)

## [1.7.2](https://github.com/meemproject/clubs-web/compare/v1.7.1...v1.7.2) (2022-09-14)

## [1.7.1](https://github.com/meemproject/clubs-web/compare/v1.7.0...v1.7.1) (2022-09-14)

# [1.7.0](https://github.com/meemproject/clubs-web/compare/v1.6.1...v1.7.0) (2022-09-14)


### Features

* upgrade lint rules ([f8d1034](https://github.com/meemproject/clubs-web/commit/f8d1034))

## [1.6.1](https://github.com/meemproject/clubs-web/compare/v1.6.0...v1.6.1) (2022-09-08)

# [1.6.0](https://github.com/meemproject/clubs-web/compare/v1.5.5...v1.6.0) (2022-09-02)


### Bug Fixes

* better upgrade detection; ([052833f](https://github.com/meemproject/clubs-web/commit/052833f))


### Features

* upgrade lint rules ([c29456e](https://github.com/meemproject/clubs-web/commit/c29456e))

## [1.5.5](https://github.com/meemproject/clubs-web/compare/v1.5.4...v1.5.5) (2022-08-22)

## [1.5.4](https://github.com/meemproject/clubs-web/compare/v1.5.3...v1.5.4) (2022-08-22)

## [1.5.3](https://github.com/meemproject/clubs-web/compare/v1.5.2...v1.5.3) (2022-08-19)

## [1.5.2](https://github.com/meemproject/clubs-web/compare/v1.5.1...v1.5.2) (2022-08-18)

## [1.5.1](https://github.com/meemproject/clubs-web/compare/v1.5.0...v1.5.1) (2022-08-15)

# [1.5.0](https://github.com/meemproject/clubs-web/compare/v1.4.0...v1.5.0) (2022-08-15)


### Features

* upgrade club ([a52b9c9](https://github.com/meemproject/clubs-web/commit/a52b9c9))

# [1.4.0](https://github.com/meemproject/clubs-web/compare/v1.3.1...v1.4.0) (2022-08-15)


### Bug Fixes

* detect wrong network ([6eea2fb](https://github.com/meemproject/clubs-web/commit/6eea2fb))
* metadata saving; do not auto-change networks ([2eb41c2](https://github.com/meemproject/clubs-web/commit/2eb41c2))
* rely on updated WalletContext instead of cookies for auth ([fc38f92](https://github.com/meemproject/clubs-web/commit/fc38f92))


### Features

* POC gnosis ([74e4a5a](https://github.com/meemproject/clubs-web/commit/74e4a5a))

## [1.3.1](https://github.com/meemproject/clubs-web/compare/v1.3.0...v1.3.1) (2022-08-11)

# [1.3.0](https://github.com/meemproject/clubs-web/compare/v1.2.1...v1.3.0) (2022-08-11)


### Bug Fixes

* remove meemid so codegen works ([18f51e1](https://github.com/meemproject/clubs-web/commit/18f51e1))


### Features

* gasless transactions ([431683f](https://github.com/meemproject/clubs-web/commit/431683f))

## [1.2.1](https://github.com/meemproject/clubs-web/compare/v1.2.0...v1.2.1) (2022-08-01)

# [1.2.0](https://github.com/meemproject/clubs-web/compare/v1.1.5...v1.2.0) (2022-07-29)


### Features

* basic hookup of gassless club creation ([4d54168](https://github.com/meemproject/clubs-web/commit/4d54168))

## [1.1.5](https://github.com/meemproject/clubs-web/compare/v1.1.4...v1.1.5) (2022-07-15)

## [1.1.4](https://github.com/meemproject/clubs-web/compare/v1.1.3...v1.1.4) (2022-06-14)


### Bug Fixes

* make eslint and prettier play nicely ([6a665d2](https://github.com/meemproject/clubs-web/commit/6a665d2))

## [1.1.3](https://github.com/meemproject/clubs-web/compare/v1.1.2...v1.1.3) (2022-06-09)

## [1.1.2](https://github.com/meemproject/clubs-web/compare/v1.1.1...v1.1.2) (2022-06-09)

## [1.1.1](https://github.com/meemproject/clubs-web/compare/v1.1.0...v1.1.1) (2022-06-07)

# [1.1.0](https://github.com/meemproject/clubs-web/compare/v1.0.0...v1.1.0) (2022-06-07)


### Bug Fixes

* version mapping ([0ff9f15](https://github.com/meemproject/clubs-web/commit/0ff9f15))


### Features

* create and upgrade proxy contracts ([afd633a](https://github.com/meemproject/clubs-web/commit/afd633a))
* create, upgrade, and mint ([ca4df4e](https://github.com/meemproject/clubs-web/commit/ca4df4e))
* upgrade meem-contracts ([5e75a77](https://github.com/meemproject/clubs-web/commit/5e75a77))

# 1.0.0 (2022-04-25)
