# [9.0.0](https://github.com/sebbo2002/ical-generator/compare/v8.1.1...v9.0.0) (2025-05-12)

- Merge remote-tracking branch 'template/typescript' into develop ([12911af](https://github.com/sebbo2002/ical-generator/commit/12911aff492741e4c6d72b4ab1082b5324d17ccf))

### chore

- Drop node v18 support ([3e18405](https://github.com/sebbo2002/ical-generator/commit/3e18405ac1e1be738a414623f97169c802567f99))
- Drop node v18 support ([fcf1711](https://github.com/sebbo2002/ical-generator/commit/fcf171117bc444a91b0b336f617ddbf2a7c61a68))

### Features

- Add support to @date-fnz/tz ([522ef9d](https://github.com/sebbo2002/ical-generator/commit/522ef9da4018650efc1ff51f1560d0f77802e675)), closes [#657](https://github.com/sebbo2002/ical-generator/issues/657)
- **attendee:** support SCHEDULE-AGENT ([7756486](https://github.com/sebbo2002/ical-generator/commit/7756486cf33400a2f82ee98d9cd8a7147fe84c11))

### BREAKING CHANGES

- Drop node.js v18 Support

This node.js version is no longer supported. For more information see https://nodejs.dev/en/about/releases/

- Drop node.js v18 Support

This node.js version is no longer supported. For more information see https://nodejs.dev/en/about/releases/

- As some ENUMs are now sorted alphabetically, the error messages have changed if no valid ENUM value was passed but one is expected. As long as you do not check the text of errors, this will not affect you.

## [8.1.1](https://github.com/sebbo2002/ical-generator/compare/v8.1.0...v8.1.1) (2025-01-14)

### Reverts

- Revert "feat: replace uuid dependency with native crypto method" ([2c95352](https://github.com/sebbo2002/ical-generator/commit/2c95352e6769cbccdbdabcb7e5391283b2b689bc))

# [8.1.0](https://github.com/sebbo2002/ical-generator/compare/v8.0.1...v8.1.0) (2025-01-09)

### Bug Fixes

- **deps:** downgrade eslint to v9.13.0 to resolve typescript-eslint issue ([b716d34](https://github.com/sebbo2002/ical-generator/commit/b716d340379690e2cf784d1d60735b77fdf3083b)), closes [#10353](https://github.com/sebbo2002/ical-generator/issues/10353) [typescript-eslint/typescript-eslint#10353](https://github.com/typescript-eslint/typescript-eslint/issues/10353)

### Features

- replace uuid dependency with native crypto method ([6628515](https://github.com/sebbo2002/ical-generator/commit/66285152c18396709196354b3128191d2154bda4))

## [8.0.1](https://github.com/sebbo2002/ical-generator/compare/v8.0.0...v8.0.1) (2024-10-16)

### Bug Fixes

- **Event:** Add missing : for ORGANIZERs ([dca6352](https://github.com/sebbo2002/ical-generator/commit/dca6352e30b042584cee7941966531400fa6f9d4)), closes [#610](https://github.com/sebbo2002/ical-generator/issues/610)
- **Event:** Handle location.geo.lat|lon = null ([7e68f00](https://github.com/sebbo2002/ical-generator/commit/7e68f0046ac927806325d68dcf31dc815efeeb8e)), closes [#618](https://github.com/sebbo2002/ical-generator/issues/618)

# [8.0.0](https://github.com/sebbo2002/ical-generator/compare/v7.2.0...v8.0.0) (2024-08-26)

### chore

- Drop support for node.js v19 and v21 ([2fff079](https://github.com/sebbo2002/ical-generator/commit/2fff079040a377fbe9ecc340388f6a29b863cf80))

### BREAKING CHANGES

- Drop node.js v21 Support

These node.js versions are no longer supported. For more information see https://nodejs.dev/en/about/releases/

# [7.2.0](https://github.com/sebbo2002/ical-generator/compare/v7.1.0...v7.2.0) (2024-08-04)

### Features

- Release `ical-generator` on jsr.io ([776a307](https://github.com/sebbo2002/ical-generator/commit/776a307164938af3896f776c39000f2526973867))

### Reverts

- Revert "chore: Replace ts-node with tsx" ([1630d2a](https://github.com/sebbo2002/ical-generator/commit/1630d2adbcaff4121e0a4531f065be5b773e292b))

# [7.1.0](https://github.com/sebbo2002/ical-generator/compare/v7.0.0...v7.1.0) (2024-04-15)

### Bug Fixes

- Use event timezone for allDay events ([1bfeaf6](https://github.com/sebbo2002/ical-generator/commit/1bfeaf64284694e4510f3e1588c683c19da03ed0))

### Features

- Apply timezone for supported allday-events ([176352c](https://github.com/sebbo2002/ical-generator/commit/176352c9dfd3d4ac0fa21c458c174ef3c4f74535)), closes [#592](https://github.com/sebbo2002/ical-generator/issues/592)

# [7.0.0](https://github.com/sebbo2002/ical-generator/compare/v6.0.1...v7.0.0) (2024-03-17)

### Bug Fixes

- **Event:** Run start/end validation only when getting data ([9174a32](https://github.com/sebbo2002/ical-generator/commit/9174a32bfe209f17f8c8460bc38187bb84dfecb0)), closes [#581](https://github.com/sebbo2002/ical-generator/issues/581)
- fixed GEO missing when supplied (closes [#569](https://github.com/sebbo2002/ical-generator/issues/569)) ([2eeceb8](https://github.com/sebbo2002/ical-generator/commit/2eeceb84feb0cb5b9cc07a93e2b8b47fc3d313a7))
- fixed typo `&&&` to `&&` ([7707b59](https://github.com/sebbo2002/ical-generator/commit/7707b595de0791c0d93f414a3340696d9e52d2ec))

### Features

- **Alarm:** Add support for `email` alarm type ([5398f09](https://github.com/sebbo2002/ical-generator/commit/5398f09809544c7529e8cabec2ee997b2a4781ae)), closes [#576](https://github.com/sebbo2002/ical-generator/issues/576)
- **Event:** Made `ICalEvent.location.title` optional to allow setting `GEO` without title ([42be230](https://github.com/sebbo2002/ical-generator/commit/42be23018544dbf75ad9ce6cfe25231d1d434cc0)), closes [#578](https://github.com/sebbo2002/ical-generator/issues/578)

### BREAKING CHANGES

- **Event:** [ICalEvent.location()](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalEvent.html#location)'s `title` field can now be undefined

## [6.0.1](https://github.com/sebbo2002/ical-generator/compare/v6.0.0...v6.0.1) (2024-01-07)

### Bug Fixes

- **Calendar:** Remove `prodId()` string validation ([a5caeaa](https://github.com/sebbo2002/ical-generator/commit/a5caeaac5187557044af652fed109fb45e5f14a5)), closes [/www.rfc-editor.org/rfc/rfc5545#section-3](https://github.com//www.rfc-editor.org/rfc/rfc5545/issues/section-3) [#555](https://github.com/sebbo2002/ical-generator/issues/555)

# [6.0.0](https://github.com/sebbo2002/ical-generator/compare/v5.0.1...v6.0.0) (2023-10-25)

### Bug Fixes

- add `browser` field to `package.json` ([7db4e32](https://github.com/sebbo2002/ical-generator/commit/7db4e32ad03b25b5cbe2cc4ce459541ee5639f15))

### Features

- Enable npm provenance ([87d173a](https://github.com/sebbo2002/ical-generator/commit/87d173a17133207492bd5c5ad2eeb70d8ecbe082))
- Enable npm provenance ([ccba971](https://github.com/sebbo2002/ical-generator/commit/ccba971b065542500d0f3fa1475eea9f849b03f0))
- Ensure Calendar is renderable all the time ([f1328a3](https://github.com/sebbo2002/ical-generator/commit/f1328a3b790507037efeb39431044c0970117cac)), closes [#344](https://github.com/sebbo2002/ical-generator/issues/344)
- Remove `save()`, `saveSync()`, `serve()`, `toBlob()`, `toURL()` ([b6bea66](https://github.com/sebbo2002/ical-generator/commit/b6bea665837c85e066ad7a32234336b01e6244f1)), closes [#478](https://github.com/sebbo2002/ical-generator/issues/478)

### Reverts

- Revert "ci: Downgrade is-semantic-release till it's fixed" ([91c2ab5](https://github.com/sebbo2002/ical-generator/commit/91c2ab59d0559a060c11d07973382c465dd3345d))

### BREAKING CHANGES

- `Alarm.trigger` now defaults to 10min before event, `Alarm.type` now defaults to `display`, `Alarm.interval()` got removed, use `Alarm.repeat()` instead, `Alarm.repeat()` now gives/takes an object instead of a number, `Attendee.email` can’t be `null | undefined`, `Category.name` can’t be `null | undefined`, `Event.start` now defaults to now (`new Date()`). For details and examples checkout the migration guide at https://github.com/sebbo2002/ical-generator/wiki/Migration-Guide:-v5-%E2%86%92-v6
- The `save()`, `saveSync()`, `serve()`, `toBlob()` and `toURL()` methods of the ICalCalendar class have been removed. Please use the `toString()` method to generate the ical string and proceed from there.

## [5.0.1](https://github.com/sebbo2002/ical-generator/compare/v5.0.0...v5.0.1) (2023-08-17)

### Bug Fixes

- double-quotes and missing filename variable ([30fcccd](https://github.com/sebbo2002/ical-generator/commit/30fcccdfb1253c37f9211833a6d74ecbf953b892))
- indentation, semicolons and quoting ([2dd4d24](https://github.com/sebbo2002/ical-generator/commit/2dd4d2494d18af843a22005a61627a3461ec29e2))

# [5.0.0](https://github.com/sebbo2002/ical-generator/compare/v4.1.0...v5.0.0) (2023-06-14)

### Build System

- Deprecate node.js v14 / v17 ([7a2de45](https://github.com/sebbo2002/ical-generator/commit/7a2de45c12f19a1ec441b3a004f4aa935efc197c))

### BREAKING CHANGES

- The node.js versions v14 and v17 are no longer maintained and are therefore no longer supported. See https://nodejs.dev/en/about/releases/ for more details on node.js release cycles.

# [4.1.0](https://github.com/sebbo2002/ical-generator/compare/v4.0.0...v4.1.0) (2023-05-04)

### Bug Fixes

- Allow `null` return value for Luxon 3.3's DateTime.toJSON() ([bee19a8](https://github.com/sebbo2002/ical-generator/commit/bee19a8e70bc690b93175c2da2a35240c55032bd)), closes [#482](https://github.com/sebbo2002/ical-generator/issues/482) [#485](https://github.com/sebbo2002/ical-generator/issues/485)
- revent changes to package.json version ([916e460](https://github.com/sebbo2002/ical-generator/commit/916e460af591ff1ebb1c757dfc9762667331f598))
- revert package-lock.json ([a8d8f2d](https://github.com/sebbo2002/ical-generator/commit/a8d8f2d45b039e80689e3cf9ac774645d6b3ccc9))

### Features

- Support trigger related behavior ([54743df](https://github.com/sebbo2002/ical-generator/commit/54743df1cce615f3df2c155c51928674afc2e3d7))

# [4.0.0](https://github.com/sebbo2002/ical-generator/compare/v3.6.1...v4.0.0) (2023-03-30)

### Bug Fixes

- **Event:** Add `RRULE:` prefix in event.repeating() if it's not already there ([92c2034](https://github.com/sebbo2002/ical-generator/commit/92c2034cae51c0e8199b6cf1746adfe7bdc85a60)), closes [#459](https://github.com/sebbo2002/ical-generator/issues/459)
- Update escaping for quoted values ([faf5c70](https://github.com/sebbo2002/ical-generator/commit/faf5c70771fb62284cd9db936b0f5812e8353730)), closes [#463](https://github.com/sebbo2002/ical-generator/issues/463)

### Build System

- Deprecate node.js 12 ([426588b](https://github.com/sebbo2002/ical-generator/commit/426588b4bb7bde2924bbc92006ca839e960872e1))
- Native ESM support ([7b86a4f](https://github.com/sebbo2002/ical-generator/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))

### Features

- ESM Module ([7e1f07a](https://github.com/sebbo2002/ical-generator/commit/7e1f07afe6ff60100df61887e6a063b382f75340))

### BREAKING CHANGES

- Importing the generator with `const ical = require('ical-generator');` (introduced with 2.1.0 / #253) will not work anymore, please use `const { default: ical } = require('ical-generator');` or move to fancy ESM imports (`import ical from 'ical-generator' ;`).
- From now on, only node.js ^14.8.0 || >=16.0.0 are supported
- Only Support for node.js ^12.20.0 || >=14.13.1

## [3.6.1](https://github.com/sebbo2002/ical-generator/compare/v3.6.0...v3.6.1) (2022-12-27)

### Bug Fixes

- **Event:** Return floating repeating until/excluded dates if floating ([011123e](https://github.com/sebbo2002/ical-generator/commit/011123ee284f8355203f2a2f2f2dc06b22e478af)), closes [#442](https://github.com/sebbo2002/ical-generator/issues/442)

# [3.6.0](https://github.com/sebbo2002/ical-generator/compare/v3.5.2...v3.6.0) (2022-10-11)

### Features

- **Event:** Update `bySetPos` and `byMonthDay` ([b19e94b](https://github.com/sebbo2002/ical-generator/commit/b19e94bdc9408acfb6e64d93de614ad25edb4ad0)), closes [#430](https://github.com/sebbo2002/ical-generator/issues/430)

## [3.5.2](https://github.com/sebbo2002/ical-generator/compare/v3.5.1...v3.5.2) (2022-09-24)

### Bug Fixes

- Include source files in npm module to allow sourcemap resolving ([2760b75](https://github.com/sebbo2002/ical-generator/commit/2760b75e67c2eb224ae1c38e8de94b4056cda7c2)), closes [#426](https://github.com/sebbo2002/ical-generator/issues/426)

## [3.5.1](https://github.com/sebbo2002/ical-generator/compare/v3.5.0...v3.5.1) (2022-07-28)

### Bug Fixes

- Remove private property from moment stub ([792adb6](https://github.com/sebbo2002/ical-generator/commit/792adb6985b88b69756916343d4c5c7929f5a82d)), closes [#411](https://github.com/sebbo2002/ical-generator/issues/411)

# [3.5.0](https://github.com/sebbo2002/ical-generator/compare/v3.4.3...v3.5.0) (2022-07-27)

### Features

- Replace external types with stub types ([56cffc7](https://github.com/sebbo2002/ical-generator/commit/56cffc7a4e9f741e779d445bfaf749b6885a4504)), closes [#405](https://github.com/sebbo2002/ical-generator/issues/405)

## [3.4.3](https://github.com/sebbo2002/ical-generator/compare/v3.4.2...v3.4.3) (2022-05-14)

## [3.4.2](https://github.com/sebbo2002/ical-generator/compare/v3.4.1...v3.4.2) (2022-04-28)

### Bug Fixes

- Do not escape quotes when not required ([08a4d62](https://github.com/sebbo2002/ical-generator/commit/08a4d626045c586302792b112c35496dd676af1d)), closes [#377](https://github.com/sebbo2002/ical-generator/issues/377)

## [3.4.1](https://github.com/sebbo2002/ical-generator/compare/v3.4.0...v3.4.1) (2022-03-31)

# [3.4.0](https://github.com/sebbo2002/ical-generator/compare/v3.3.0...v3.4.0) (2022-03-21)

### Features

- Add Support for Sent By ([9aac3e0](https://github.com/sebbo2002/ical-generator/commit/9aac3e0e5e0bb54b1400da8ef42e1544f033a72a)), closes [#358](https://github.com/sebbo2002/ical-generator/issues/358)

# [3.3.0](https://github.com/sebbo2002/ical-generator/compare/v3.2.1...v3.3.0) (2022-03-21)

### Features

- added `types` property to declaration file ([01518e0](https://github.com/sebbo2002/ical-generator/commit/01518e048d785724f01be69a77bce6b58e2843d8))

## [3.2.1](https://github.com/sebbo2002/ical-generator/compare/v3.2.0...v3.2.1) (2022-01-28)

### Bug Fixes

- Update error URLs ([2628464](https://github.com/sebbo2002/ical-generator/commit/262846466808a043b4b241a17b38503c7949e78f)), closes [#343](https://github.com/sebbo2002/ical-generator/issues/343)

# [3.2.0](https://github.com/sebbo2002/ical-generator/compare/v3.1.1...v3.2.0) (2022-01-12)

### Bug Fixes

- **Attendee:** Print RSVP also if rsvp is set to false ([27e5166](https://github.com/sebbo2002/ical-generator/commit/27e51668710c3f6eff4c3ad4c5e64028444aca05)), closes [#340](https://github.com/sebbo2002/ical-generator/issues/340)

### Features

- **Events:** Add `createAttachment` / `attachments` ([12a382f](https://github.com/sebbo2002/ical-generator/commit/12a382fedb798460891d327bd9c112b1c97c38ee)), closes [#335](https://github.com/sebbo2002/ical-generator/issues/335)

## [3.1.1](https://github.com/sebbo2002/ical-generator/compare/v3.1.0...v3.1.1) (2021-12-13)

### Bug Fixes

- **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/ical-generator/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))

# [3.1.0](https://github.com/sebbo2002/ical-generator/compare/v3.0.1...v3.1.0) (2021-11-17)

### Bug Fixes

- Remove Blob usage to support modern browsers ([c4e33d3](https://github.com/sebbo2002/ical-generator/commit/c4e33d3405338f42cc299cc927b851a67a88b3ad)), closes [#325](https://github.com/sebbo2002/ical-generator/issues/325)

### Features

- **Calendar:** Handle `timezone('UTC')` correctly ([c0745e5](https://github.com/sebbo2002/ical-generator/commit/c0745e50101d3f29e51ddecce7da4a4e445ccc81)), closes [#328](https://github.com/sebbo2002/ical-generator/issues/328)
- **event:** Add support for event class ([a227aa2](https://github.com/sebbo2002/ical-generator/commit/a227aa27d293305e307861149aad3888caf5eafe))
- **Event:** Handle `timezone('UTC')` correctly ([781dc3d](https://github.com/sebbo2002/ical-generator/commit/781dc3d67296cef67652e8a97600f7678d6ac191)), closes [#328](https://github.com/sebbo2002/ical-generator/issues/328)

## [3.0.1](https://github.com/sebbo2002/ical-generator/compare/v3.0.0...v3.0.1) (2021-10-01)

### Bug Fixes

- **Event:** Append address to `LOCATION` even without `radius` / `geo` ([09ea62e](https://github.com/sebbo2002/ical-generator/commit/09ea62eb073bd79e66c8905841a93810fcea0634)), closes [#314](https://github.com/sebbo2002/ical-generator/issues/314)

# [3.0.0](https://github.com/sebbo2002/ical-generator/compare/v2.2.0...v3.0.0) (2021-07-31)

# [3.0.0-develop.8](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.7...v3.0.0-develop.8) (2021-08-26)

### Bug Fixes

- Make peerDependencies less strict ([1c3a8f2](https://github.com/sebbo2002/ical-generator/commit/1c3a8f2f1d8880c6f94d7e06df8b5498a7418f01)), closes [#303](https://github.com/sebbo2002/ical-generator/issues/303)

### chore

- Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/ical-generator/commit/2b910c09bc8a41085fc4472159494d8738d5521e))

### BREAKING CHANGES

- Removed support for node.js v10

# [3.0.0-develop.7](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.6...v3.0.0-develop.7) (2021-07-28)

# [3.0.0-develop.6](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.5...v3.0.0-develop.6) (2021-07-28)

# [3.0.0-develop.5](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.4...v3.0.0-develop.5) (2021-07-28)

# [3.0.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.3...v3.0.0-develop.4) (2021-07-22)

### Bug Fixes

- Make peerDependencies less strict ([1c3a8f2](https://github.com/sebbo2002/ical-generator/commit/1c3a8f2f1d8880c6f94d7e06df8b5498a7418f01)), closes [#303](https://github.com/sebbo2002/ical-generator/issues/303)

# [3.0.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.2...v3.0.0-develop.3) (2021-06-18)

# [3.0.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v3.0.0-develop.1...v3.0.0-develop.2) (2021-06-08)

# [3.0.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.2.0...v3.0.0-develop.1) (2021-06-08)

### chore

- Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/ical-generator/commit/2b910c09bc8a41085fc4472159494d8738d5521e))

### BREAKING CHANGES

- Removed support for node.js v10

# [2.2.0](https://github.com/sebbo2002/ical-generator/compare/v2.1.0...v2.2.0) (2021-05-24)

### Features

- **Calendar:** Add `source()`, thanks [@irfaan](https://github.com/irfaan) ([91a764f](https://github.com/sebbo2002/ical-generator/commit/91a764fa135fe325b58f391b6a198f8807796350)), closes [#260](https://github.com/sebbo2002/ical-generator/issues/260)

# [2.2.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.1.1-develop.1...v2.2.0-develop.1) (2021-05-24)

### Features

- **Calendar:** Add `source()`, thanks [@irfaan](https://github.com/irfaan) ([91a764f](https://github.com/sebbo2002/ical-generator/commit/91a764fa135fe325b58f391b6a198f8807796350)), closes [#260](https://github.com/sebbo2002/ical-generator/issues/260)

## [2.1.1-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.1.0...v2.1.1-develop.1) (2021-05-17)

# [2.1.0](https://github.com/sebbo2002/ical-generator/compare/v2.0.0...v2.1.0) (2021-05-13)

### Features

- Allow use of `require('ical-generator')` without `.default` ([31833a6](https://github.com/sebbo2002/ical-generator/commit/31833a60d3123f9b4ac10677dcad3871a892f32c)), closes [#253](https://github.com/sebbo2002/ical-generator/issues/253)
- Export `formatDate` and some other tool functions ([6142e11](https://github.com/sebbo2002/ical-generator/commit/6142e11f631011aff9be8df129980dfac411d4f2)), closes [#248](https://github.com/sebbo2002/ical-generator/issues/248)
- first commit ([dc8fa4a](https://github.com/sebbo2002/ical-generator/commit/dc8fa4a2ce97c6f0ab55e3371b83f5388b5da0c9))

# [2.1.0-develop.6](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.5...v2.1.0-develop.6) (2021-05-13)

# [2.1.0-develop.5](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.4...v2.1.0-develop.5) (2021-05-12)

# [2.1.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.3...v2.1.0-develop.4) (2021-05-12)

### Features

- Allow use of `require('ical-generator')` without `.default` ([31833a6](https://github.com/sebbo2002/ical-generator/commit/31833a60d3123f9b4ac10677dcad3871a892f32c)), closes [#253](https://github.com/sebbo2002/ical-generator/issues/253)

# [2.1.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.2...v2.1.0-develop.3) (2021-05-10)

### Features

- first commit ([dc8fa4a](https://github.com/sebbo2002/ical-generator/commit/dc8fa4a2ce97c6f0ab55e3371b83f5388b5da0c9))

# [2.1.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.1.0-develop.1...v2.1.0-develop.2) (2021-05-01)

# [2.1.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.3...v2.1.0-develop.1) (2021-04-30)

### Features

- Export `formatDate` and some other tool functions ([6142e11](https://github.com/sebbo2002/ical-generator/commit/6142e11f631011aff9be8df129980dfac411d4f2)), closes [#248](https://github.com/sebbo2002/ical-generator/issues/248)

## [2.0.1-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.2...v2.0.1-develop.3) (2021-04-30)

## [2.0.1-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.0.1-develop.1...v2.0.1-develop.2) (2021-04-29)

## [2.0.1-develop.1](https://github.com/sebbo2002/ical-generator/compare/v2.0.0...v2.0.1-develop.1) (2021-04-29)

# [2.0.0](https://github.com/sebbo2002/ical-generator/compare/v1.15.4...v2.0.0) (2021-04-28)

### Bug Fixes

- **package.json:** add temporary version ([0bc117e](https://github.com/sebbo2002/ical-generator/commit/0bc117e557d3fb4680345287c4dbb2549b2ecd32))
- Allow to set null values within object constructors ([8b87183](https://github.com/sebbo2002/ical-generator/commit/8b8718305096466669b5d2cdcf318825cb8145ae))
- **deps:** Also define libs as devDependency for tests ([c04ae32](https://github.com/sebbo2002/ical-generator/commit/c04ae321c59739f86df89b71ff0db11b63ef762f))
- **deps:** Define supported libs as peerDependencies ([84e2784](https://github.com/sebbo2002/ical-generator/commit/84e278460a33ec4dbb08fdeeed55f6fd1a9be15b))
- Make peer dependencies optional ([b384ac7](https://github.com/sebbo2002/ical-generator/commit/b384ac7838f1694f698f1fd921ddbd401ad66424)), closes [#244](https://github.com/sebbo2002/ical-generator/issues/244)
- **Tools:** Prevent formatDate() from using global timezones prefixed with a slash ([85ab7b2](https://github.com/sebbo2002/ical-generator/commit/85ab7b221b0ab7cee858d82374c52405cf610c94))
- **deps:** Put necessary typings in peerDependencies as well :/ ([14f0f43](https://github.com/sebbo2002/ical-generator/commit/14f0f43dc23facea9f7aec16144a8546d0b7af3f))
- **Event:** Remove `moment` dependency in constructor ([8331d4c](https://github.com/sebbo2002/ical-generator/commit/8331d4ce09949d68f678211ff1f1906d1cd5d98d)), closes [#234](https://github.com/sebbo2002/ical-generator/issues/234)

### Code Refactoring

- **Calendar:** Remove moment.Duration from `ttl()` method ([c6ccd12](https://github.com/sebbo2002/ical-generator/commit/c6ccd12ed9e4f63e1876e3e06e7f13c38f1400ae))
- Update error URLs ([2aedf55](https://github.com/sebbo2002/ical-generator/commit/2aedf552f4d79da49c6a3b0d990fb1f4b82c5a64))

### Features

- **Event:** Add `priority()` method ([247039f](https://github.com/sebbo2002/ical-generator/commit/247039fe2959dd5c5dbcb7772d4d2afa3406b987)), closes [#163](https://github.com/sebbo2002/ical-generator/issues/163)
- **Attendee:** Add `x()` method for custom attributes ([5d9d686](https://github.com/sebbo2002/ical-generator/commit/5d9d6863dbc07c1054d858e83c3890588e8a6840)), closes [#183](https://github.com/sebbo2002/ical-generator/issues/183)
- **Calendar:** add new clear method ([1ebefcb](https://github.com/sebbo2002/ical-generator/commit/1ebefcb3057db88870474bbb8da6c70ed9cb7336)), closes [#188](https://github.com/sebbo2002/ical-generator/issues/188)
- Add ReleaseBot ([2fba164](https://github.com/sebbo2002/ical-generator/commit/2fba16478db12c0dd50b7c537cc3806395e64818))
- **Calendar:** Add support for external VTimezone generator ([f4bc8e0](https://github.com/sebbo2002/ical-generator/commit/f4bc8e0535caecd1651b765f513722929d6b72b8)), closes [#122](https://github.com/sebbo2002/ical-generator/issues/122)
- **Event:** Allow `X-APPLE-STRUCTURED-LOCATION` without address ([4e63e29](https://github.com/sebbo2002/ical-generator/commit/4e63e2914a4ac7956047b9011cfca177bcdb926a)), closes [#236](https://github.com/sebbo2002/ical-generator/issues/236)
- **Event:** Make organizer.email optional ([8450492](https://github.com/sebbo2002/ical-generator/commit/8450492525d43d0de9d01a8f756cb76c43a77ff3)), closes [#137](https://github.com/sebbo2002/ical-generator/issues/137)
- **Event:** Merge `location()`, `appleLocation()` and `geo()` ([62c1516](https://github.com/sebbo2002/ical-generator/commit/62c1516ce8c1ffee566dfb8cc70f2431a6325fe9)), closes [#187](https://github.com/sebbo2002/ical-generator/issues/187)
- Merge event's `description()` and `htmlDescription()` ([ce537f8](https://github.com/sebbo2002/ical-generator/commit/ce537f8f56c1f3651938b75e884ae76814187daf))
- Support moment.js, Day.js and Luxon ([#91](https://github.com/sebbo2002/ical-generator/issues/91), BREAKING CHANGE) ([6db24ee](https://github.com/sebbo2002/ical-generator/commit/6db24ee4887fca212a3a730e84fda9dd9c84ea01))
- **Event:** Support RRule objects and raw strings in `repeating()` ([4436785](https://github.com/sebbo2002/ical-generator/commit/4436785894dfda4d0186283f89848d9a9a00ce6a)), closes [#190](https://github.com/sebbo2002/ical-generator/issues/190)
- Updated the entire codebase to Typescript ([d013dc0](https://github.com/sebbo2002/ical-generator/commit/d013dc0199c9a9dce5181b9c89adf144bde17cea))
- **Events:** Use uuid-random for random UUIDs (close [#215](https://github.com/sebbo2002/ical-generator/issues/215)) ([a4c19cc](https://github.com/sebbo2002/ical-generator/commit/a4c19ccdba037e7196b47bb571c26f2e6068f538))

### BREAKING CHANGES

- Some error messages changed, so if you check for error , please double check them now.
- `htmlDescription()` was removed, use `description()` instead.
- **Calendar:** `ttl()` will now return a number, not a `moment.Duration`. You can still use `moment.Duration` to set the `ttl` value.
- **Event:** `geo()` and `appleLocation()` are not available anymore, use `location()` instead and pass an location object (with title, radius, etc.)
- **Calendar:** Calendar's `clear()` method is a completely new implementation and, unlike previous versions, will not reset metadata such as `name` or `prodId`. Only the events will be removed

# [2.0.0-develop.22](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.21...v2.0.0-develop.22) (2021-04-28)

# [2.0.0-develop.21](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.20...v2.0.0-develop.21) (2021-04-17)

### Bug Fixes

- Make peer dependencies optional ([b384ac7](https://github.com/sebbo2002/ical-generator/commit/b384ac7838f1694f698f1fd921ddbd401ad66424)), closes [#244](https://github.com/sebbo2002/ical-generator/issues/244)

# [2.0.0-develop.20](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.19...v2.0.0-develop.20) (2021-04-14)

### Bug Fixes

- **Tools:** Prevent formatDate() from using global timezones prefixed with a slash ([85ab7b2](https://github.com/sebbo2002/ical-generator/commit/85ab7b221b0ab7cee858d82374c52405cf610c94))

### Features

- **Calendar:** Add support for external VTimezone generator ([f4bc8e0](https://github.com/sebbo2002/ical-generator/commit/f4bc8e0535caecd1651b765f513722929d6b72b8)), closes [#122](https://github.com/sebbo2002/ical-generator/issues/122)

# [2.0.0-develop.19](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.18...v2.0.0-develop.19) (2021-04-10)

### Features

- Add ReleaseBot ([2fba164](https://github.com/sebbo2002/ical-generator/commit/2fba16478db12c0dd50b7c537cc3806395e64818))

# [2.0.0-develop.18](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.17...v2.0.0-develop.18) (2021-04-09)

### Features

- **Event:** Allow `X-APPLE-STRUCTURED-LOCATION` without address ([4e63e29](https://github.com/sebbo2002/ical-generator/commit/4e63e2914a4ac7956047b9011cfca177bcdb926a)), closes [#236](https://github.com/sebbo2002/ical-generator/issues/236)

# [2.0.0-develop.17](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.16...v2.0.0-develop.17) (2021-04-02)

# [2.0.0-develop.16](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.15...v2.0.0-develop.16) (2021-04-02)

### Bug Fixes

- **deps:** Put necessary typings in peerDependencies as well :/ ([14f0f43](https://github.com/sebbo2002/ical-generator/commit/14f0f43dc23facea9f7aec16144a8546d0b7af3f))

# [2.0.0-develop.15](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.14...v2.0.0-develop.15) (2021-04-02)

### Bug Fixes

- **deps:** Also define libs as devDependency for tests ([c04ae32](https://github.com/sebbo2002/ical-generator/commit/c04ae321c59739f86df89b71ff0db11b63ef762f))
- **deps:** Define supported libs as peerDependencies ([84e2784](https://github.com/sebbo2002/ical-generator/commit/84e278460a33ec4dbb08fdeeed55f6fd1a9be15b))

# [2.0.0-develop.14](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.13...v2.0.0-develop.14) (2021-03-28)

### Bug Fixes

- Allow to set null values within object constructors ([8b87183](https://github.com/sebbo2002/ical-generator/commit/8b8718305096466669b5d2cdcf318825cb8145ae))

# [2.0.0-develop.13](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.12...v2.0.0-develop.13) (2021-03-26)

### Code Refactoring

- Update error URLs ([2aedf55](https://github.com/sebbo2002/ical-generator/commit/2aedf552f4d79da49c6a3b0d990fb1f4b82c5a64))

### BREAKING CHANGES

- Some error messages changed, so if you check for error , please double check them now.

# [2.0.0-develop.12](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.11...v2.0.0-develop.12) (2021-03-26)

### Reverts

- Revert "chore: Update package.json" ([2ad5716](https://github.com/sebbo2002/ical-generator/commit/2ad57163882b7171f45269b3742da9ead23510f4))

# [2.0.0-develop.11](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.10...v2.0.0-develop.11) (2021-03-26)

### chore

- Update package.json ([a3c7037](https://github.com/sebbo2002/ical-generator/commit/a3c7037404c6c12fec7a892d39bfd4cfd8c6a00a))

### BREAKING CHANGES

- Set minimum node.js version to 12.0.0

# [2.0.0-develop.10](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.9...v2.0.0-develop.10) (2021-03-25)

# [2.0.0-develop.9](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.8...v2.0.0-develop.9) (2021-03-24)

# [2.0.0-develop.8](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.7...v2.0.0-develop.8) (2021-03-23)

### Features

- **Attendee:** Add `x()` method for custom attributes ([5d9d686](https://github.com/sebbo2002/ical-generator/commit/5d9d6863dbc07c1054d858e83c3890588e8a6840)), closes [#183](https://github.com/sebbo2002/ical-generator/issues/183)

# [2.0.0-develop.7](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.6...v2.0.0-develop.7) (2021-03-23)

### Features

- **Event:** Add `priority()` method ([247039f](https://github.com/sebbo2002/ical-generator/commit/247039fe2959dd5c5dbcb7772d4d2afa3406b987)), closes [#163](https://github.com/sebbo2002/ical-generator/issues/163)

# [2.0.0-develop.6](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.5...v2.0.0-develop.6) (2021-03-23)

### Features

- **Event:** Make organizer.email optional ([8450492](https://github.com/sebbo2002/ical-generator/commit/8450492525d43d0de9d01a8f756cb76c43a77ff3)), closes [#137](https://github.com/sebbo2002/ical-generator/issues/137)

# [2.0.0-develop.5](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.4...v2.0.0-develop.5) (2021-03-23)

### Features

- **Event:** Support RRule objects and raw strings in `repeating()` ([4436785](https://github.com/sebbo2002/ical-generator/commit/4436785894dfda4d0186283f89848d9a9a00ce6a)), closes [#190](https://github.com/sebbo2002/ical-generator/issues/190)

# [2.0.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.3...v2.0.0-develop.4) (2021-03-23)

### Bug Fixes

- **Event:** Remove `moment` dependency in constructor ([8331d4c](https://github.com/sebbo2002/ical-generator/commit/8331d4ce09949d68f678211ff1f1906d1cd5d98d)), closes [#234](https://github.com/sebbo2002/ical-generator/issues/234)

# [2.0.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.2...v2.0.0-develop.3) (2021-03-23)

### Code Refactoring

- **Calendar:** Remove moment.Duration from `ttl()` method ([c6ccd12](https://github.com/sebbo2002/ical-generator/commit/c6ccd12ed9e4f63e1876e3e06e7f13c38f1400ae))

### Features

- Merge event's `description()` and `htmlDescription()` ([ce537f8](https://github.com/sebbo2002/ical-generator/commit/ce537f8f56c1f3651938b75e884ae76814187daf))

### BREAKING CHANGES

- `htmlDescription()` was removed, use `description()` instead.
- **Calendar:** `ttl()` will now return a number, not a `moment.Duration`. You can still use `moment.Duration` to set the `ttl` value.

# [2.0.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v2.0.0-develop.1...v2.0.0-develop.2) (2021-03-22)

### Features

- **Event:** Merge `location()`, `appleLocation()` and `geo()` ([62c1516](https://github.com/sebbo2002/ical-generator/commit/62c1516ce8c1ffee566dfb8cc70f2431a6325fe9)), closes [#187](https://github.com/sebbo2002/ical-generator/issues/187)

### BREAKING CHANGES

- **Event:** `geo()` and `appleLocation()` are not available anymore, use `location()` instead and pass an location object (with title, radius, etc.)

# [2.0.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.4...v2.0.0-develop.1) (2021-03-21)

### Features

- **Calendar:** add new clear method ([1ebefcb](https://github.com/sebbo2002/ical-generator/commit/1ebefcb3057db88870474bbb8da6c70ed9cb7336)), closes [#188](https://github.com/sebbo2002/ical-generator/issues/188)

### BREAKING CHANGES

- **Calendar:** Calendar's `clear()` method is a completely new implementation and, unlike previous versions, will not reset metadata such as `name` or `prodId`. Only the events will be removed

# [1.3.0-develop.4](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.3...v1.3.0-develop.4) (2021-03-21)

### Features

- Support moment.js, Day.js and Luxon ([#91](https://github.com/sebbo2002/ical-generator/issues/91), BREAKING CHANGE) ([6db24ee](https://github.com/sebbo2002/ical-generator/commit/6db24ee4887fca212a3a730e84fda9dd9c84ea01))

# [1.3.0-develop.3](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.2...v1.3.0-develop.3) (2021-03-13)

# [1.3.0-develop.2](https://github.com/sebbo2002/ical-generator/compare/v1.3.0-develop.1...v1.3.0-develop.2) (2021-03-05)

### Features

- **Events:** Use uuid-random for random UUIDs (close [#215](https://github.com/sebbo2002/ical-generator/issues/215)) ([a4c19cc](https://github.com/sebbo2002/ical-generator/commit/a4c19ccdba037e7196b47bb571c26f2e6068f538))

# [1.3.0-develop.1](https://github.com/sebbo2002/ical-generator/compare/v1.2.1...v1.3.0-develop.1) (2021-02-27)

### Bug Fixes

- **package.json:** add temporary version ([0bc117e](https://github.com/sebbo2002/ical-generator/commit/0bc117e557d3fb4680345287c4dbb2549b2ecd32))
- allow X-attrs to be specified in constructor ([#185](https://github.com/sebbo2002/ical-generator/issues/185)) ([58c1ae5](https://github.com/sebbo2002/ical-generator/commit/58c1ae5d30ede4842f2cdcb4eb9458d1d27c63ff))
- capitalize byDay even when bySetPos is used ([#205](https://github.com/sebbo2002/ical-generator/issues/205)) ([5440fbc](https://github.com/sebbo2002/ical-generator/commit/5440fbc90baa93e5313ef1e328ef4ff81273eb79))
- **Typings:** Fix OPT-PARTICIPANT ([b777f9e](https://github.com/sebbo2002/ical-generator/commit/b777f9e14c1ae256d809b0f1777ac773b64e1308)), closes [#192](https://github.com/sebbo2002/ical-generator/issues/192)
- Fix scale type for CalendarData ([#191](https://github.com/sebbo2002/ical-generator/issues/191)) ([d5421e8](https://github.com/sebbo2002/ical-generator/commit/d5421e8782327a985fa4c08bd4609779a67512cf))
- Make x key optional in types ([#211](https://github.com/sebbo2002/ical-generator/issues/211)) ([e3c21e2](https://github.com/sebbo2002/ical-generator/commit/e3c21e27a69317e0e8a2a81eca32ae358d57b00c))
- Type fixes and updates ([#217](https://github.com/sebbo2002/ical-generator/issues/217)) ([d8abe4d](https://github.com/sebbo2002/ical-generator/commit/d8abe4d43bb0eb1edb49f84b966ea6094cb0d562))

### Features

- **Events:** Add appleLocation method ([#170](https://github.com/sebbo2002/ical-generator/issues/170)) ([0956ba2](https://github.com/sebbo2002/ical-generator/commit/0956ba2c687ac46dc3faa9e02565682fda0c50a9))
- Add missing string input options to interface ([#199](https://github.com/sebbo2002/ical-generator/issues/199)) ([a963178](https://github.com/sebbo2002/ical-generator/commit/a963178099b64caa5c4d6e99cee75b3882b823cb))
- Add Transparency Method ([bd2901d](https://github.com/sebbo2002/ical-generator/commit/bd2901d248ec679a960f598025867aa08b0ee73a))
- Increase id entropy - Fixes [#200](https://github.com/sebbo2002/ical-generator/issues/200) ([#202](https://github.com/sebbo2002/ical-generator/issues/202)) ([6711b0a](https://github.com/sebbo2002/ical-generator/commit/6711b0aab745b4c20201b6cec91fb00818cf6d0d))
- make domain optional ([#209](https://github.com/sebbo2002/ical-generator/issues/209)) ([e3362c9](https://github.com/sebbo2002/ical-generator/commit/e3362c94e2b055043d3db74c51563d6107a5a097))
- Updated the entire codebase to Typescript ([d013dc0](https://github.com/sebbo2002/ical-generator/commit/d013dc0199c9a9dce5181b9c89adf144bde17cea))
- **Events:** use provided timezone when constructing repeating.exclude ([#210](https://github.com/sebbo2002/ical-generator/issues/210)) ([bd84230](https://github.com/sebbo2002/ical-generator/commit/bd84230db85c68e343507007b84830d2b39b4a1d))
