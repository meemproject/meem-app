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
