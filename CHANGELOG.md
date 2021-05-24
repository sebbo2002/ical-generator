# [2.2.0](https://github.com/sebbo2002/ical-generator/compare/v2.1.0...v2.2.0) (2021-05-24)


### Features

* **Calendar:** Add `source()`, thanks [@irfaan](https://github.com/irfaan) ([91a764f](https://github.com/sebbo2002/ical-generator/commit/91a764fa135fe325b58f391b6a198f8807796350)), closes [#260](https://github.com/sebbo2002/ical-generator/issues/260)

# [2.2.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.1.1-develop.1...v2.2.0-develop.1) (2021-05-24)


### Features

* **Calendar:** Add `source()`, thanks [@irfaan](https://github.com/irfaan) ([91a764f](https://github.com/sebbo2002/ical-generator/commit/91a764fa135fe325b58f391b6a198f8807796350)), closes [#260](https://github.com/sebbo2002/ical-generator/issues/260)

## [2.1.1-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.1.0...v2.1.1-develop.1) (2021-05-17)

# [2.1.0](https://github.com/sebbo2002/ical-generator/compare/v2.0.0...v2.1.0) (2021-05-13)


### Features

* Allow use of `require('ical-generator')` without `.default` ([31833a6](https://github.com/sebbo2002/ical-generator/commit/31833a60d3123f9b4ac10677dcad3871a892f32c)), closes [#253](https://github.com/sebbo2002/ical-generator/issues/253)
* Export `formatDate` and some other tool functions ([6142e11](https://github.com/sebbo2002/ical-generator/commit/6142e11f631011aff9be8df129980dfac411d4f2)), closes [#248](https://github.com/sebbo2002/ical-generator/issues/248)
* first commit ([dc8fa4a](https://github.com/sebbo2002/ical-generator/commit/dc8fa4a2ce97c6f0ab55e3371b83f5388b5da0c9))

# [2.1.0-develop.6](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.5...v2.1.0-develop.6) (2021-05-13)

# [2.1.0-develop.5](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.4...v2.1.0-develop.5) (2021-05-12)

# [2.1.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.3...v2.1.0-develop.4) (2021-05-12)


### Features

* Allow use of `require('ical-generator')` without `.default` ([31833a6](https://github.com/sebbo2002/ical-generator/commit/31833a60d3123f9b4ac10677dcad3871a892f32c)), closes [#253](https://github.com/sebbo2002/ical-generator/issues/253)

# [2.1.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.2...v2.1.0-develop.3) (2021-05-10)


### Features

* first commit ([dc8fa4a](https://github.com/sebbo2002/ical-generator/commit/dc8fa4a2ce97c6f0ab55e3371b83f5388b5da0c9))

# [2.1.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.1...v2.1.0-develop.2) (2021-05-01)

# [2.1.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.3...v2.1.0-develop.1) (2021-04-30)


### Features

* Export `formatDate` and some other tool functions ([6142e11](https://github.com/sebbo2002/ical-generator/commit/6142e11f631011aff9be8df129980dfac411d4f2)), closes [#248](https://github.com/sebbo2002/ical-generator/issues/248)

## [2.0.1-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.2...v2.0.1-develop.3) (2021-04-30)

## [2.0.1-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.1...v2.0.1-develop.2) (2021-04-29)

## [2.0.1-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.0.0...v2.0.1-develop.1) (2021-04-29)

# [2.0.0](https://github.com/sebbo2002/ical-generator/compare/v1.15.4...v2.0.0) (2021-04-28)


### Bug Fixes

* **package.json:** add temporary version ([0bc117e](https://github.com/sebbo2002/ical-generator/commit/0bc117e557d3fb4680345287c4dbb2549b2ecd32))
* Allow to set null values within object constructors ([8b87183](https://github.com/sebbo2002/ical-generator/commit/8b8718305096466669b5d2cdcf318825cb8145ae))
* **deps:** Also define libs as devDependency for tests ([c04ae32](https://github.com/sebbo2002/ical-generator/commit/c04ae321c59739f86df89b71ff0db11b63ef762f))
* **deps:** Define supported libs as peerDependencies ([84e2784](https://github.com/sebbo2002/ical-generator/commit/84e278460a33ec4dbb08fdeeed55f6fd1a9be15b))
* Make peer dependencies optional ([b384ac7](https://github.com/sebbo2002/ical-generator/commit/b384ac7838f1694f698f1fd921ddbd401ad66424)), closes [#244](https://github.com/sebbo2002/ical-generator/issues/244)
* **Tools:** Prevent formatDate() from using global timezones prefixed with a slash ([85ab7b2](https://github.com/sebbo2002/ical-generator/commit/85ab7b221b0ab7cee858d82374c52405cf610c94))
* **deps:** Put necessary typings in peerDependencies as well :/ ([14f0f43](https://github.com/sebbo2002/ical-generator/commit/14f0f43dc23facea9f7aec16144a8546d0b7af3f))
* **Event:** Remove `moment` dependency in constructor ([8331d4c](https://github.com/sebbo2002/ical-generator/commit/8331d4ce09949d68f678211ff1f1906d1cd5d98d)), closes [#234](https://github.com/sebbo2002/ical-generator/issues/234)


### Code Refactoring

* **Calendar:** Remove moment.Duration from `ttl()` method ([c6ccd12](https://github.com/sebbo2002/ical-generator/commit/c6ccd12ed9e4f63e1876e3e06e7f13c38f1400ae))
* Update error URLs ([2aedf55](https://github.com/sebbo2002/ical-generator/commit/2aedf552f4d79da49c6a3b0d990fb1f4b82c5a64))


### Features

* **Event:** Add `priority()` method ([247039f](https://github.com/sebbo2002/ical-generator/commit/247039fe2959dd5c5dbcb7772d4d2afa3406b987)), closes [#163](https://github.com/sebbo2002/ical-generator/issues/163)
* **Attendee:** Add `x()` method for custom attributes ([5d9d686](https://github.com/sebbo2002/ical-generator/commit/5d9d6863dbc07c1054d858e83c3890588e8a6840)), closes [#183](https://github.com/sebbo2002/ical-generator/issues/183)
* **Calendar:** add new clear method ([1ebefcb](https://github.com/sebbo2002/ical-generator/commit/1ebefcb3057db88870474bbb8da6c70ed9cb7336)), closes [#188](https://github.com/sebbo2002/ical-generator/issues/188)
* Add ReleaseBot ([2fba164](https://github.com/sebbo2002/ical-generator/commit/2fba16478db12c0dd50b7c537cc3806395e64818))
* **Calendar:** Add support for external VTimezone generator ([f4bc8e0](https://github.com/sebbo2002/ical-generator/commit/f4bc8e0535caecd1651b765f513722929d6b72b8)), closes [#122](https://github.com/sebbo2002/ical-generator/issues/122)
* **Event:** Allow `X-APPLE-STRUCTURED-LOCATION` without address ([4e63e29](https://github.com/sebbo2002/ical-generator/commit/4e63e2914a4ac7956047b9011cfca177bcdb926a)), closes [#236](https://github.com/sebbo2002/ical-generator/issues/236)
* **Event:** Make organizer.email optional ([8450492](https://github.com/sebbo2002/ical-generator/commit/8450492525d43d0de9d01a8f756cb76c43a77ff3)), closes [#137](https://github.com/sebbo2002/ical-generator/issues/137)
* **Event:** Merge `location()`, `appleLocation()` and `geo()` ([62c1516](https://github.com/sebbo2002/ical-generator/commit/62c1516ce8c1ffee566dfb8cc70f2431a6325fe9)), closes [#187](https://github.com/sebbo2002/ical-generator/issues/187)
* Merge event's `description()` and `htmlDescription()` ([ce537f8](https://github.com/sebbo2002/ical-generator/commit/ce537f8f56c1f3651938b75e884ae76814187daf))
* Support moment.js, Day.js and Luxon ([#91](https://github.com/sebbo2002/ical-generator/issues/91), BREAKING CHANGE) ([6db24ee](https://github.com/sebbo2002/ical-generator/commit/6db24ee4887fca212a3a730e84fda9dd9c84ea01))
* **Event:** Support RRule objects and raw strings in `repeating()` ([4436785](https://github.com/sebbo2002/ical-generator/commit/4436785894dfda4d0186283f89848d9a9a00ce6a)), closes [#190](https://github.com/sebbo2002/ical-generator/issues/190)
* Updated the entire codebase to Typescript ([d013dc0](https://github.com/sebbo2002/ical-generator/commit/d013dc0199c9a9dce5181b9c89adf144bde17cea))
* **Events:** Use uuid-random for random UUIDs (close [#215](https://github.com/sebbo2002/ical-generator/issues/215)) ([a4c19cc](https://github.com/sebbo2002/ical-generator/commit/a4c19ccdba037e7196b47bb571c26f2e6068f538))


### BREAKING CHANGES

* Some error messages changed, so if you check for error , please double check them now.
* `htmlDescription()` was removed, use `description()` instead.
* **Calendar:** `ttl()` will now return a number, not a `moment.Duration`. You can still use `moment.Duration` to set the `ttl` value.
* **Event:** `geo()` and `appleLocation()` are not available anymore, use `location()` instead and pass an location object (with title, radius, etc.)
* **Calendar:** Calendar's `clear()` method is a completely new implementation and, unlike previous versions, will not reset metadata such as `name` or `prodId`. Only the events will be removed

# [2.0.0-develop.22](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.21...v2.0.0-develop.22) (2021-04-28)

# [2.0.0-develop.21](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.20...v2.0.0-develop.21) (2021-04-17)


### Bug Fixes

* Make peer dependencies optional ([b384ac7](https://github.com/sebbo2002/ical-generator/commit/b384ac7838f1694f698f1fd921ddbd401ad66424)), closes [#244](https://github.com/sebbo2002/ical-generator/issues/244)

# [2.0.0-develop.20](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.19...v2.0.0-develop.20) (2021-04-14)


### Bug Fixes

* **Tools:** Prevent formatDate() from using global timezones prefixed with a slash ([85ab7b2](https://github.com/sebbo2002/ical-generator/commit/85ab7b221b0ab7cee858d82374c52405cf610c94))


### Features

* **Calendar:** Add support for external VTimezone generator ([f4bc8e0](https://github.com/sebbo2002/ical-generator/commit/f4bc8e0535caecd1651b765f513722929d6b72b8)), closes [#122](https://github.com/sebbo2002/ical-generator/issues/122)

# [2.0.0-develop.19](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.18...v2.0.0-develop.19) (2021-04-10)


### Features

* Add ReleaseBot ([2fba164](https://github.com/sebbo2002/ical-generator/commit/2fba16478db12c0dd50b7c537cc3806395e64818))

# [2.0.0-develop.18](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.17...v2.0.0-develop.18) (2021-04-09)


### Features

* **Event:** Allow `X-APPLE-STRUCTURED-LOCATION` without address ([4e63e29](https://github.com/sebbo2002/ical-generator/commit/4e63e2914a4ac7956047b9011cfca177bcdb926a)), closes [#236](https://github.com/sebbo2002/ical-generator/issues/236)

# [2.0.0-develop.17](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.16...v2.0.0-develop.17) (2021-04-02)

# [2.0.0-develop.16](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.15...v2.0.0-develop.16) (2021-04-02)


### Bug Fixes

* **deps:** Put necessary typings in peerDependencies as well :/ ([14f0f43](https://github.com/sebbo2002/ical-generator/commit/14f0f43dc23facea9f7aec16144a8546d0b7af3f))

# [2.0.0-develop.15](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.14...v2.0.0-develop.15) (2021-04-02)


### Bug Fixes

* **deps:** Also define libs as devDependency for tests ([c04ae32](https://github.com/sebbo2002/ical-generator/commit/c04ae321c59739f86df89b71ff0db11b63ef762f))
* **deps:** Define supported libs as peerDependencies ([84e2784](https://github.com/sebbo2002/ical-generator/commit/84e278460a33ec4dbb08fdeeed55f6fd1a9be15b))

# [2.0.0-develop.14](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.13...v2.0.0-develop.14) (2021-03-28)


### Bug Fixes

* Allow to set null values within object constructors ([8b87183](https://github.com/sebbo2002/ical-generator/commit/8b8718305096466669b5d2cdcf318825cb8145ae))

# [2.0.0-develop.13](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.12...v2.0.0-develop.13) (2021-03-26)


### Code Refactoring

* Update error URLs ([2aedf55](https://github.com/sebbo2002/ical-generator/commit/2aedf552f4d79da49c6a3b0d990fb1f4b82c5a64))


### BREAKING CHANGES

* Some error messages changed, so if you check for error , please double check them now.

# [2.0.0-develop.12](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.11...v2.0.0-develop.12) (2021-03-26)


### Reverts

* Revert "chore: Update package.json" ([2ad5716](https://github.com/sebbo2002/ical-generator/commit/2ad57163882b7171f45269b3742da9ead23510f4))

# [2.0.0-develop.11](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.10...v2.0.0-develop.11) (2021-03-26)


### chore

* Update package.json ([a3c7037](https://github.com/sebbo2002/ical-generator/commit/a3c7037404c6c12fec7a892d39bfd4cfd8c6a00a))


### BREAKING CHANGES

* Set minimum node.js version to 12.0.0

# [2.0.0-develop.10](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.9...v2.0.0-develop.10) (2021-03-25)

# [2.0.0-develop.9](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.8...v2.0.0-develop.9) (2021-03-24)

# [2.0.0-develop.8](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.7...v2.0.0-develop.8) (2021-03-23)


### Features

* **Attendee:** Add `x()` method for custom attributes ([5d9d686](https://github.com/sebbo2002/ical-generator/commit/5d9d6863dbc07c1054d858e83c3890588e8a6840)), closes [#183](https://github.com/sebbo2002/ical-generator/issues/183)

# [2.0.0-develop.7](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.6...v2.0.0-develop.7) (2021-03-23)


### Features

* **Event:** Add `priority()` method ([247039f](https://github.com/sebbo2002/ical-generator/commit/247039fe2959dd5c5dbcb7772d4d2afa3406b987)), closes [#163](https://github.com/sebbo2002/ical-generator/issues/163)

# [2.0.0-develop.6](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.5...v2.0.0-develop.6) (2021-03-23)


### Features

* **Event:** Make organizer.email optional ([8450492](https://github.com/sebbo2002/ical-generator/commit/8450492525d43d0de9d01a8f756cb76c43a77ff3)), closes [#137](https://github.com/sebbo2002/ical-generator/issues/137)

# [2.0.0-develop.5](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.4...v2.0.0-develop.5) (2021-03-23)


### Features

* **Event:** Support RRule objects and raw strings in `repeating()` ([4436785](https://github.com/sebbo2002/ical-generator/commit/4436785894dfda4d0186283f89848d9a9a00ce6a)), closes [#190](https://github.com/sebbo2002/ical-generator/issues/190)

# [2.0.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.3...v2.0.0-develop.4) (2021-03-23)


### Bug Fixes

* **Event:** Remove `moment` dependency in constructor ([8331d4c](https://github.com/sebbo2002/ical-generator/commit/8331d4ce09949d68f678211ff1f1906d1cd5d98d)), closes [#234](https://github.com/sebbo2002/ical-generator/issues/234)

# [2.0.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.2...v2.0.0-develop.3) (2021-03-23)


### Code Refactoring

* **Calendar:** Remove moment.Duration from `ttl()` method ([c6ccd12](https://github.com/sebbo2002/ical-generator/commit/c6ccd12ed9e4f63e1876e3e06e7f13c38f1400ae))


### Features

* Merge event's `description()` and `htmlDescription()` ([ce537f8](https://github.com/sebbo2002/ical-generator/commit/ce537f8f56c1f3651938b75e884ae76814187daf))


### BREAKING CHANGES

* `htmlDescription()` was removed, use `description()` instead.
* **Calendar:** `ttl()` will now return a number, not a `moment.Duration`. You can still use `moment.Duration` to set the `ttl` value.

# [2.0.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.1...v2.0.0-develop.2) (2021-03-22)


### Features

* **Event:** Merge `location()`, `appleLocation()` and `geo()` ([62c1516](https://github.com/sebbo2002/ical-generator/commit/62c1516ce8c1ffee566dfb8cc70f2431a6325fe9)), closes [#187](https://github.com/sebbo2002/ical-generator/issues/187)


### BREAKING CHANGES

* **Event:** `geo()` and `appleLocation()` are not available anymore, use `location()` instead and pass an location object (with title, radius, etc.)

# [2.0.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.4...v2.0.0-develop.1) (2021-03-21)


### Features

* **Calendar:** add new clear method ([1ebefcb](https://github.com/sebbo2002/ical-generator/commit/1ebefcb3057db88870474bbb8da6c70ed9cb7336)), closes [#188](https://github.com/sebbo2002/ical-generator/issues/188)


### BREAKING CHANGES

* **Calendar:** Calendar's `clear()` method is a completely new implementation and, unlike previous versions, will not reset metadata such as `name` or `prodId`. Only the events will be removed

# [1.3.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.3...v1.3.0-develop.4) (2021-03-21)


### Features

* Support moment.js, Day.js and Luxon ([#91](https://github.com/sebbo2002/ical-generator/issues/91), BREAKING CHANGE) ([6db24ee](https://github.com/sebbo2002/ical-generator/commit/6db24ee4887fca212a3a730e84fda9dd9c84ea01))

# [1.3.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.2...v1.3.0-develop.3) (2021-03-13)

# [1.3.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.1...v1.3.0-develop.2) (2021-03-05)


### Features

* **Events:** Use uuid-random for random UUIDs (close [#215](https://github.com/sebbo2002/ical-generator/issues/215)) ([a4c19cc](https://github.com/sebbo2002/ical-generator/commit/a4c19ccdba037e7196b47bb571c26f2e6068f538))

# [1.3.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v1.2.1...v1.3.0-develop.1) (2021-02-27)


### Bug Fixes

* **package.json:** add temporary version ([0bc117e](https://github.com/sebbo2002/ical-generator/commit/0bc117e557d3fb4680345287c4dbb2549b2ecd32))
* allow X-attrs to be specified in constructor ([#185](https://github.com/sebbo2002/ical-generator/issues/185)) ([58c1ae5](https://github.com/sebbo2002/ical-generator/commit/58c1ae5d30ede4842f2cdcb4eb9458d1d27c63ff))
* capitalize byDay even when bySetPos is used ([#205](https://github.com/sebbo2002/ical-generator/issues/205)) ([5440fbc](https://github.com/sebbo2002/ical-generator/commit/5440fbc90baa93e5313ef1e328ef4ff81273eb79))
* **Typings:** Fix OPT-PARTICIPANT ([b777f9e](https://github.com/sebbo2002/ical-generator/commit/b777f9e14c1ae256d809b0f1777ac773b64e1308)), closes [#192](https://github.com/sebbo2002/ical-generator/issues/192)
* Fix scale type for CalendarData ([#191](https://github.com/sebbo2002/ical-generator/issues/191)) ([d5421e8](https://github.com/sebbo2002/ical-generator/commit/d5421e8782327a985fa4c08bd4609779a67512cf))
* Make x key optional in types ([#211](https://github.com/sebbo2002/ical-generator/issues/211)) ([e3c21e2](https://github.com/sebbo2002/ical-generator/commit/e3c21e27a69317e0e8a2a81eca32ae358d57b00c))
* Type fixes and updates ([#217](https://github.com/sebbo2002/ical-generator/issues/217)) ([d8abe4d](https://github.com/sebbo2002/ical-generator/commit/d8abe4d43bb0eb1edb49f84b966ea6094cb0d562))


### Features

* **Events:** Add appleLocation method ([#170](https://github.com/sebbo2002/ical-generator/issues/170)) ([0956ba2](https://github.com/sebbo2002/ical-generator/commit/0956ba2c687ac46dc3faa9e02565682fda0c50a9))
* Add missing string input options to interface ([#199](https://github.com/sebbo2002/ical-generator/issues/199)) ([a963178](https://github.com/sebbo2002/ical-generator/commit/a963178099b64caa5c4d6e99cee75b3882b823cb))
* Add Transparency Method ([bd2901d](https://github.com/sebbo2002/ical-generator/commit/bd2901d248ec679a960f598025867aa08b0ee73a))
* Increase id entropy - Fixes [#200](https://github.com/sebbo2002/ical-generator/issues/200) ([#202](https://github.com/sebbo2002/ical-generator/issues/202)) ([6711b0a](https://github.com/sebbo2002/ical-generator/commit/6711b0aab745b4c20201b6cec91fb00818cf6d0d))
* make domain optional ([#209](https://github.com/sebbo2002/ical-generator/issues/209)) ([e3362c9](https://github.com/sebbo2002/ical-generator/commit/e3362c94e2b055043d3db74c51563d6107a5a097))
* Updated the entire codebase to Typescript ([d013dc0](https://github.com/sebbo2002/ical-generator/commit/d013dc0199c9a9dce5181b9c89adf144bde17cea))
* **Events:** use provided timezone when constructing repeating.exclude ([#210](https://github.com/sebbo2002/ical-generator/issues/210)) ([bd84230](https://github.com/sebbo2002/ical-generator/commit/bd84230db85c68e343507007b84830d2b39b4a1d))
