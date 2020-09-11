# Changelog
All notable changes to this project will be documented in this file. The changes are grouped by the date (ISO-8601) and the package version they have been added to. The `Unreleased` section keeps track of upcoming changes.

## [2.0.2] (2020-09-11)
### Bug Fixes
- Exporting the JSFJsonSchema interface to allow for strongly typed objects
- Removing extra padding to give the parent project more styling control 

## [2.0.1] (2020-09-08)
### Bug Fixes
- Removing old test JSON Schema.
- Fixing bug where the configurable enableCollapsibleSections was the inverse of what we wanted to display.
- Fixing bug where items at the root level that were not in a section did not have the same label length.
- Removed extra horizontal lines from the top and bottom of the form and simplified some styling.- 

## [2.0.0] (2020-08-28)
### Breaking Changes
- Validation Keyword Update
- Usability Refactor
- Modified enums to look at an enumNames array for labels

### Enhancement
- V1 to V2 Translation Service
- Integer Support
- Adding an Event Button
- Read Only Form Fields
- Add Textarea
- Add tabbed display
- Added hidden form elements
- JSF Rebranding Refactor
- Add max length support
- Angular + Typescript Upgrade

### Bug Fixes
- Updating old property name in launcher the lint missed
- Updating publishing scripts to handle excluding Ivy

### Documentation
- Changelog Formatting

## [1.0.0] (2020-02-28)
### Added
- [1](https://github.com/cleo/ngx-json-schema-form/pull/1) - Made the JSON Schema Form into standalone library containing the following features:
	- Checkboxes
	- Checkboxes with Children
	- Dropdowns
	- Radio Buttons
	- Dropdowns with Children
	- Integer Inputs
	- Sections
	- Text Inputs
	- Text Inputs (Secured)

[1.0.0]: https://github.com/cleo/ngx-json-schema-form/releases/tag/1.0.0
