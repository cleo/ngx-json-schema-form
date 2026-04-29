# NGX JSON Schema Form - Copilot Instructions

## Project Overview

This is the `@cleo/ngx-json-schema-form` Angular library. It uses Angular 20, ag-grid 35, TypeScript 5.8, and standalone components.

## Crowsnest Integration

The primary consumer of this library is the **crowsnest** client repo. Crowsnest currently uses Angular 18 and ag-grid 28, so backward compatibility is critical.

### ag-grid Backward Compatibility

ag-grid 35 moved several APIs from `columnApi` to `api`. When using ag-grid APIs, always provide fallbacks for ag-grid 28:

```ts
// Example: getAllDisplayedColumns
const columns = this.params.api.getAllDisplayedColumns?.() ?? this.params.columnApi?.getAllDisplayedColumns?.() ?? [];

// Example: autoSizeColumns
const autoSize = this.params.api.autoSizeColumns?.bind(this.params.api) ?? this.params.columnApi?.autoSizeColumns?.bind(this.params.columnApi);
if (autoSize) { autoSize(columnIds, false); }
```

Use `rowSelection: 'multiple'` (string format) instead of the object-based `rowSelection` config, as ag-grid 28 does not support the object format. Add `checkboxSelection: true` and `headerCheckboxSelection: true` directly on column definitions.

### Build, Pack, and Install in Crowsnest

After making changes to the JSF library, run this sequence to update crowsnest to test the changes locally:

```bash
# 1. Build the library
cd /c/engineering/ngx-json-schema-form
npm run build-jsf-prod

# 2. Pack it
cd dist/jsf
rm -f *.tgz
npm pack

# 3. Clear caches and install in crowsnest
cd <user crowsnest/client folder>
npm cache clean --force
rm -rf node_modules/jsf .angular/cache
npm install jsf@file:<path to .tgz file from step 2>

# 4. Restart the crowsnest dev server
npm run serve
```

### Testing

- **jsf-launcher** (local test harness): run with `npm run serve` from `projects/jsf-launcher`
- **crowsnest**: run with `npm run serve` from `crowsnest/client`

If the users wants they can test the changes in both environments. The jsf-launcher uses the same Angular/ag-grid versions as the library, while crowsnest uses older versions and is the real compatibility test.
