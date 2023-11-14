# Changelog
All notable changes to this project will be documented in this file. The changes are grouped by the date (ISO-8601) and the package version they have been added to. The `Unreleased` section keeps track of upcoming changes.

## [6.0.2] (2023-11-14)
### Bug Fix
- Fix Secured Text Input values to always be treated as a string

## [6.0.1] (2023-07-20)
### Bug Fix
- Target ES2015

## [6.0.0] (2023-07-20)
### Enhancement
- Update to Angular 15, TypeScript 4.9.5, and Node 18.12.0

## [5.0.2] (2023-06-22)
### Bug fix
- Fix label size on edit of checkbox with children

## [5.0.1] (2023-04-10)
### Enhancement
- Add styling class to tabstrip when the form group is disabled.

## [5.0.0] (2023-02-07)
### Enhancement
- Update to Angular 13, TypeScript 4.6.4, Node 16.18.0

### Breaking Changes
- Removed jsf-tabstrip element. Any CSS for this element should instead use class .jsf-tabstrip
- Removed jsf-one-of-drop-down element. Any CSS for this element should instead use class .jsf-one-of-drop-down. 

## [4.1.6] (2022-10-31)
### Bug fixes
- Fixed URI validation regex timing out with long URIs.

## [4.1.5] (2022-09-02)
### Bug fixes
- Changed URI validation to be compliant with RFC-3986 

## [4.1.4] (2022-08-03)
### Bug fixes
- Modified URI text format to only allow valid URI characters, and for additional URI validation to run during the JSF BE validation.

## [4.1.3] (2022-04-20)
### Bug fixes
- Fixed jsf readme not pointing to correct schemaV2.json file.

## [4.1.2] (2022-03-02)
### Bug fixes
- Modified URI text format to not limit the last part of subdomain to three characters

## [4.1.1] (2021-12-23)
### Bug fixes
- Use defaults from schema on validation

## [4.1.0] (2021-06-29)
### Enhancement
- Added template type support for custom templates inside schemas

## [4.0.1] (2021-05-24)
### Bug Fixes
- Secured fields within a oneOf should not be returned. Added optional parameter to getNonSecuredValues to return the key with a null value to support oneOf

## [4.0.0] (2021-05-21)
### Bug Fixes
- OneOf: XOf Enum values should not be sent when retrieving form values. These were added for JSF to display the data as a dropdown but is not part of the schema specification. All child properties should have unique key names so that the matching OneOf subschema can be determined.

## [3.1.1] (2021-05-13)
### Bug Fixes
- Empty array should not be defaulted to empty string
- SecuredSchemaValueValidationService.getNonSecuredValues should handle arrays properly

## [3.1.0] (2021-05-05)
### Enhancement
- Add limited array support


## [3.0.2] (2021-04-23)
### Bug Fixes
- SchemaValidationService will validate hidden and read-only fields

## [3.0.1] (2021-04-16)
### Bug Fixes
- Removed @cleo/ngx-json-schema-form-validation package's dependecy on @cleo/ngx-json-schema-form

## [3.0.0] (2021-04-12)
### Bug Fixes
- Enum values are always required. Radio buttons and Dropdowns are different ways to display the same data: an option must always be selected. Due to this, the 'Select an option' option from dropdown display on enums has been deprecated.
### Enhancement
- Disable browser autofill of values

## [2.1.3] (2021-03-31)
### Bug Fixes
- Remove dependency on lodash-es.

## [2.1.2] (2021-03-23)
### Bug Fixes
- Fixing bug where SchemaValidationService was not exported.

## [2.1.1] (2021-03-22)
### Bug Fixes
- Fixing bug where exclusiveMinimum and minimum would not allow a value of zero. 

## [2.1.0] (2021-03-19)
### Enhancement
- Add Integer support for exclusiveMaximum, exclusiveMinimum, maximum, and minimum keywords.
- Add String support for pattern keyword.
- Add an entire schema validator using AJV.

## [2.0.3] (2020-10-15)
### Enhancement
- Exporting the FormDataItemService to be used in external projects.

## [2.0.2] (2020-09-11)
### Enhancement
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
