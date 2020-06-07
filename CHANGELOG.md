# 🗓 Changelog

_The following document documents changes to this library. Changes to the dependencies are not listed. Minor changes and updates to the documentation are not listed here._

<br />

## [1.11.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.11.0) - 2020-06-07
### Bugfix
- Fix scale typescript definition

### Feature
- Add Transparency Method


## [1.10.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.10.0) - 2020-04-13
### Feature
- Add appleLocation method


## [1.9.3](https://github.com/sebbo2002/ical-generator/releases/tag/1.9.4) - 2020-03-27
### Bugfix
- Allow X-attrs to be specified in constructor


## [1.9.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.9.2) - 2019-12-14
### Feature
- Fix `\r\n` issue for custom attributes using `x()`


## [1.9.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.9.0) - 2019-11-30
### Feature
- `x()` method – add custom parameters like `X-WR-CALNAME`

### Maintenance
- Add this changelog file
- Move from private GitLab CI to GitHub Actions

## [1.8.3](https://github.com/sebbo2002/ical-generator/releases/tag/1.8.3) - 2019-11-12
### Feature
- `toBlob()` method in (only for browsers)


## [1.8.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.8.2) - 2019-10-30
### Bugfix
- Update Typescript definition to match JavaScript implementation
### Maintenance
- Upgrade to Babel 7


## [1.8.1](https://github.com/sebbo2002/ical-generator/releases/tag/1.8.1) - 2019-09-04
### Bugfix
- Fix a problem with moment objects from different moment versions


## [1.8.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.8.0) - 2019-09-03
### Maintenance
- Add Runkit example
### Feature
- `CALSCALE` support with the `scale()` method


## [1.7.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.7.2) - 2019-06-08
### Maintenance
- Also run unit tests on node.js 12


## [1.7.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.7.0) - 2019-04-08
### Bugfix
- Fix bug `geo` attribute for json imports
### Feature
- `excludeTimezone` feature for events


## [1.6.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.6.0) - 2019-02-26
### Bugfix
### Feature
- `recurrenceId` feature for events


## [1.5.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.5.0) - 2019-02-14
### Bugfix
### Feature
- `geo()` for latitude/longitude usage
### Maintenance
- remove `npm run visualize`


## [1.4.4](https://github.com/sebbo2002/ical-generator/releases/tag/1.4.4) - 2019-01-14
### Bugfix
- Typescript Definition fixes
### Maintenance
- Documentation fixes
- Use `yarn import` to generate yarn lockfile


## [1.4.3](https://github.com/sebbo2002/ical-generator/releases/tag/1.4.3) - 2019-01-07
### Maintenance
- Use strict equals and deep strict equals in unit tests


## [1.4.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.4.2) - 2018-12-10
### Maintenance
- Readme spelling and grammar fixes
- JSDoc corrections


## [1.4.1](https://github.com/sebbo2002/ical-generator/releases/tag/1.4.1) - 2018-12-08
### Bugfix
- Correct typescript definition import
### Maintenance
- Run npm-check for every build


## [1.4.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.4.0) - 2018-11-24
### Feature
- `repeating.bySetPos` support for events


## [1.3.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.3.0) - 2018-10-24
### Feature
- Add mailto attribute to attendees and organizer


## [1.2.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.2.2) - 2018-10-16
### Feature
- Add multiple examples, e.g. for express or koa
### Maintenance
- CI runs all scripts, not just the tests


## [1.2.1](https://github.com/sebbo2002/ical-generator/releases/tag/1.2.1) - 2018-10-08
### Bugfix
- Publish dist folder in npm module


## [1.2.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.2.0) - 2018-10-07
### Bugfix
- Fix all day repeating exclusions
- Add `NEEDS-ACTION` for `allowed()`


## [1.1.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.1.0) - 2018-09-10
### Bugfix
- Fix event categories
- Publish precompiled files on npm


## [1.0.4](https://github.com/sebbo2002/ical-generator/releases/tag/1.0.4) - 2018-08-25
### Bugfix
- Typescipt definition: fix `tostring()`


## [1.0.3](https://github.com/sebbo2002/ical-generator/releases/tag/1.0.3) - 2018-08-15
### Bugfix
- Typescript definition: fix moment typing
- Typescript definition: remove `method()` definition
- Typescript definition: fix `attendeeType`


## [1.0.2](https://github.com/sebbo2002/ical-generator/releases/tag/1.0.2) - 2018-07-20
### Feature
- Support for Microsoft's busystatus with `busystatus()`
### Maintenance
- Update CI structure
- Publish test report after build
- Publish coverage report after build


## [1.0.1](https://github.com/sebbo2002/ical-generator/releases/tag/1.0.1) - 2018-07-15
### Maintenance
- Update Readme
- CI improvements


## [1.0.0](https://github.com/sebbo2002/ical-generator/releases/tag/1.0.0) - 2018-07-14
### Bugfix
- Don't rely on non-standard RegExp.$1-$9
- Use `moment-timezone` to fix timezone bugs
### Feature
- Add `transp()` method to set the appointment transparency
- Add support for RSVP expectations (`rsvp()`)
- Add `created()` and `lastModified()`
- Add Chair and Opt-Participant Role
- Add event categories support
- Typescript definition
### Maintenance
- Complete rewrite with same API as 0.x
- Removed typings from readme
- Add badges in readme
- Setup GitLab CI
- Add unit tests for node.js 9 and 10
- Added some unit tests
- Add `npm run browser-test` to prepare browser based unit tests
- Update examples
### Breaking Changes
- Dropped support for node.js <= 4


## [0.2.9](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.9) - 2016-10-21
### Bugfix
- Fix lines longer than 75 bytes
- Fix `TENATIVE` typo
### Feature
- Add `htmlDescription` to set HTML description


## [0.2.8](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.8) - 2016-09-13
### Bugfix
- Move method parameter from event to calendar object
### Feature
- `repeating.exclude` support
- `htmlDescription` support
### Maintenance
- Imporved documentation
- Improved test coverage


## [0.2.7](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.7) - 2016-01-24
### Bugfix
- `X-MICROSOFT-CDO-ALLDAYEVENT` support
- `X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT` support
- `X-WR-CALDESC` support
### Feature
- Inherit event timezone from calendar
- Allow setters to reset a parameter to null again


## [0.2.6](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.6) - 2015-12-14
### Feature
- Event timezone method
- Event sequence parameter support


## [0.2.5](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.5) - 2015-12-14
### Bugfix
- Fix an error that causes an error to be thrown if no end time is specified
### Feature
- TTL support (`REFRESH-INTERVAL` / `X-PUBLISHED-TTL`)
- Support for `URL` parameter
- Add parameter `NAME` for existing `name()` method (filled only `X-WR-CALNAME` before)
- Add parameter `TIMEZONE-ID` for existing `timezone()` method (filled only `X-WR-TIMEZONE` before)


## [0.2.4](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.4) - 2015-09-20
### Feature
- Extend event's `repeating()` with `byDay`, `byMonth` and `byMonthDay`
- Add `toJSON()` method for every object type


## [0.2.3](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.3) - 2015-08-23
### Bugfix
### Feature
- Add `type()` method to set the `CUTYPE` parameter for an attendee


## [0.2.2](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.2) - 2015-06-07
### Bugfix
- Explicitly send used charset in `serve()` to prevent encoding errors
### Feature


## [0.2.1](https://github.com/sebbo2002/ical-generator/releases/tag/0.2.1) - 2015-04-02
### Bugfix
- Use Windows flavored new lines (CR + LF) to prevent issues
### Feature
- Alarm support
