# MD-Soft Project Architecture

> Navigation map only. Verify source files before making changes.

---

## Project Structure

```
src/app/
├── auth/                         Login module
├── core/
│   ├── enum/                     SliderDisplayLocation
│   ├── interface/                All shared interfaces
│   └── service/
│       ├── data/                 ApiDataService, GenericCrudService, HybridQueryEngine
│       ├── auth.service.ts
│       ├── Layout.service.ts     Sidebar menu, pageTitle signal
│       ├── lookup.service.ts     Cached dropdown data
│       ├── orders.service.ts
│       ├── students.service.ts
│       ├── teachers.service.ts
│       └── ...feature services
├── layout-module/
│   ├── header-componant/         Reads route, sets pageTitle
│   ├── sidebar/                  Renders menuItems, collapse/expand state
│   └── layout-componant/         Shell with router-outlet
└── modules/
    ├── shared/                   All reusable UI components
    ├── orders/                   List page + detail page (partial)
    ├── conversations/            Empty shell — no components
    ├── products/                 Empty shell — no components
    ├── users/
    │   ├── students/             Page + modal (full), details (empty shell)
    │   └── teachers/             Page + modal (full reference implementation)
    ├── sliders/                  Full CRUD with image upload
    ├── reservation/              Full form with cascading dropdowns
    └── notifications/            Send-only form
```

**Backend:** json-server at `http://localhost:3000`  
**Angular:** v21 — all feature modules use `standalone: false`  
**Module loading:** All feature modules are lazy-loaded via `module-routing-module.ts`

---

## Core Architecture

### ApiDataService
**Path:** `src/app/core/service/data/api.data.service.ts`

HTTP wrapper over `HttpClient`. All methods use `take(1)` / `first()`.

```
get(endpoint, queryParams?) → Observable<T>
post(endpoint, body)        → Observable<T>
put(endpoint, body)         → PATCH under the hood
delete(endpoint)            → Observable<T>
```

Base URL is hardcoded: `http://localhost:3000`.

---

### GenericCrudService
**Path:** `src/app/core/service/data/generic-crud.service.ts`

Abstract base class. Extend with `super('endpoint', apiService)`.

**Public API:**
- `items$: Observable<T[]>` — BehaviorSubject, source of truth for local mode
- `loadAll(queryParams?)` — fetches all, pushes to `items$`
- `loadByQuery(query)` — returns Observable, does NOT update `items$`
- `getById<TResult>(id)` — typed override supported
- `add(item)` — posts + optimistic prepend to `items$`
- `update(id, partial)` — patches + optimistic merge in `items$`
- `delete(id)` — deletes + optimistic remove from `items$`

**All feature services extend this.** Do not duplicate CRUD logic.

---

### HybridQueryEngine
**Path:** `src/app/core/service/data/hybrid-query-engine.service.ts`

Generic query engine. Instantiate once per page, destroy on `ngOnDestroy`.

**Constructor:**
```ts
new HybridQueryEngine<T>(
  fetchFromServer: (query) => Observable<T[]>,   // for server mode
  localQueryStrategy: (data, query) => T[],       // feature filter logic
  source$?: Observable<T[]>,                       // typically service.items$
  mode?: 'local' | 'server'                        // default 'local'
)
```

**Public API:**
- `result$: Observable<T[]>` — paginated/filtered data to bind
- `pagination$: Observable<IPaginationState>` — `{currentPage, pageSize, totalItems, totalPages}`
- `query$: Observable<IQueryEngine>` — current query state
- `patchQuery(partial)` — merges partial, resets to page 1 unless `_page` is in partial
- `refresh()` — re-runs current query
- `refreshSource()` — reloads from scratch
- `reset()` — restores `{_page:1, _limit:10}`
- `destroy()` — unsubscribes all

**Default initial query:** `{ _page: 1, _limit: 7 }`

**IQueryEngine** (`core/interface/IQueryEngine.ts`):
```ts
{ searchTerm?, _page?, _limit?, _sort?, _order?, filters?, [key: string]: any }
```
Extra keys (e.g., `startDate`, `endDate`, `orderType`) are allowed via index signature.

---

### LookupService
**Path:** `src/app/core/service/lookup.service.ts`

Cached `shareReplay(1)` observable per endpoint.

```ts
getOptions(endpoint, labelKey = 'name', valueKey = 'id'): Observable<ISelectOption[]>
invalidateCache(endpoint): void
```

Call `invalidateCache` after `add` or `delete` operations that affect dropdown data.

---

## Shared Infrastructure

**Module path:** `src/app/modules/shared/shared-module.ts`  
All components declared and exported from `SharedModule`. Import `SharedModule` in any feature module that needs them.

### GenericTable
**Path:** `src/app/modules/shared/kit/generic-table-component/generic-table-component.ts`

Inputs: `columns: ITableColumn[]`, `data: any[]`, `currentPage`, `totalPages`  
Outputs: `actionClick`, `toggleChange`, `pageChange`

Cell types (`IGenericTable.ts`): `text | toggle | actions | date | badge | user`

Action column config: `{ id, label, icon?, color? }[]`  
Badge column config: `{ [statusValue]: { text, bgColor, textColor } }`  
Toggle in actions column: `hasToggle: true`, `toggleKey: 'fieldName'`

### UiModalComponent (modal shell)
**Path:** `src/app/modules/shared/kit/model/ui-modal-component/ui-modal-component.ts`  
Selector: `app-modal-container`

Inputs: `isOpen`, `title`, `size` (`vsm|sm|md|lg|xl`), `confirmLabel`, `cancelLabel`, `confirmTheme` (`primary|error|success`), `isConfirmDisabled`  
Outputs: `closeModal`, `confirm`

Content projection: place form inside component tags.

### ConfirmationDialog
**Path:** `src/app/modules/shared/kit/confirmation-dialog/confirmation-dialog.ts`

Inputs: `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `size`, `confirmTheme`, `isLoading`  
Outputs: `confirm`, `cancel`

### Form Components
| Selector | Path | Notes |
|---|---|---|
| `app-ui-input` | `kit/model/ui-input-component/ui-input.ts` | `control`, `type`, `placeholder`, `icon` |
| `app-ui-select` | `kit/model/ui-select-component/ui-select-component.ts` | `control: FormControl`, `options`, `icon` |
| `app-ui-popup-select` | `kit/model/ui-popup-select/ui-popup-select.ts` | Searchable. Hybrid: `control` OR `value`+`valueChange` |
| `app-btn-switch` | `kit/action/btn-switch/btn-switch.ts` | `checked`, emits `toggle` |

### UiImageUploadComponent
**Path:** `src/app/modules/shared/kit/model/ui-image-upload-component/ui-image-upload-component.ts`

Inputs: `isOpen`, `existingImageUrl`  
Output: `fileSelected: EventEmitter<string | null>` — emits Base64 string or `null`

**Constraint:** Images only (`file.type.startsWith('image/')`). No size limit. No video. No audio.

### InnerActionHeader
**Path:** `src/app/modules/shared/kit/inner-action-header/inner-action-header.ts`

Inputs: `showSearch`, `showActionButton`, `showFilterButton`, `showDate`, `actionLabel`, `actionIcon`, `searchPlaceholder`, `btnIcon`  
Outputs: `search` (debounced 500ms), `actionClicked`, `sortChange: 'asc'|'desc'`, `dateRangeChange: {startDate, endDate}`

---

## Standard Feature Module Pattern

Full reference implementation: **TeacherPage + TeachersModal**  
Paths: `modules/users/teachers/teacher-page/teacher-page.ts` + `modules/users/teachers/teachers-modal/teachers-modal.ts`

### Page (container) responsibilities
1. Inject feature service and lookups
2. Declare `tableColumns: ITableColumn[]`
3. Instantiate `HybridQueryEngine` with `service.loadByQuery`, `filterLocally()`, `service.items$`
4. `ngOnInit`: `service.loadAll().subscribe()` + load lookups
5. Handle `onTableActionClick()` — switch on `actionId`
6. Handle `onToggleChange()` — call `service.update()`
7. Manage modal state: `isModalOpen`, `modalMode`, `selectedEntityForEdit`
8. `onSave()` — branch add vs edit, call service, close modal
9. Manage confirmation dialog state for delete: `isConfirmationDialogOpen`, `isDeleting`, `idToDelete`
10. `confirmDelete()` — call `service.delete()`, close dialog
11. Handle `onPageChange`, `onSearch`, `onSortChange`, `onDateRangeChange` — all call `engine.patchQuery()`

### Modal (presentation) responsibilities
- Inputs: `isOpen`, `mode: 'add'|'edit'`, entity data, lookup lists
- Outputs: `closeModal`, `save`
- `ngOnInit`: init `FormGroup`
- `ngOnChanges`: watch `isOpen` → call `handleModalOpen()` to patch or reset form
- `onSubmit()`: validate, build payload, emit `save`
- Manages own avatar/file state via `UiImageUploadComponent`

### Feature Service
```ts
@Injectable({ providedIn: 'root' })
export class XService extends GenericCrudService<IEntity> {
  constructor(apiService: ApiDataService) {
    super('endpoint', apiService);
  }
}
```

---

## Query / Data Flow

```
service.loadAll()
    ↓
service.items$ (BehaviorSubject)
    ↓
HybridQueryEngine (source = items$, mode = 'local')
    ↓  triggered by queryState$
filterLocally(data, query)  ← feature-specific filter function
    ↓
HybridQueryEngine.buildLocalResult() — sorting + pagination
    ↓
result$ / pagination$
    ↓
Template: (engine.result$ | async) → app-generic-table [data]
          (engine.pagination$ | async) → [currentPage] [totalPages]
```

User interactions → `engine.patchQuery(partial)` → query re-runs automatically.

---

## Layout / Sidebar Architecture

**LayoutServices** (`core/service/Layout.service.ts`):
- `menuItems: ISidebarItem[]` — static array, owns sidebar structure
- `pageTitle = signal<string>('')` — set by HeaderComponent on route change
- `findTitleByRoute(routePath)` — used by header to resolve title

**Sidebar** reads `menuItems` from `LayoutServices`. Manages `isCollapsed` and `expandedMenuId` as local signals. No external state dependency.

**HeaderComponent** subscribes to `router.events`, calls `findTitleByRoute`, sets `layoutServices.pageTitle`.

Adding a new route to the sidebar requires adding an entry to `menuItems` in `LayoutServices`.

---

## State Ownership Conventions

| State Type | Owner | Mechanism |
|---|---|---|
| Server data cache | Feature service (`items$`) | `BehaviorSubject` in `GenericCrudService` |
| Query state | `HybridQueryEngine` | `BehaviorSubject<IQueryEngine>` |
| Pagination | `HybridQueryEngine` | `BehaviorSubject<IPaginationState>` |
| Modal open/mode/selection | Feature page | Plain class properties |
| Form state | Feature modal component | `FormGroup` (Reactive Forms) |
| Delete confirmation | Feature page | `isConfirmationDialogOpen`, `idToDelete`, `isDeleting` |
| Loading / saving | Feature page/modal | `isSaving`, `isLoading`, `isDeleting` boolean flags |
| Sidebar collapse | `Sidebar` component | `signal()` local to component |
| Page title | `LayoutServices` | `signal<string>` |
| Lookup / dropdown data | `LookupService` | `shareReplay(1)` cached observables |

---

## Important Architectural Rules

1. **Extend GenericCrudService** — do not create parallel HTTP methods.
2. **Instantiate HybridQueryEngine in the page** — do not put query logic in services.
3. **Feature business logic belongs in the page** — GenericTable only emits events.
4. **filterLocally must be a pure function** — `(data, query) => T[]` — no side effects.
5. **Modals are presentation components** — they emit events, the page calls services.
6. **One source of truth per entity** — `service.items$` is the single cache; do not hold a separate copy in the page.
7. **LookupService cache must be invalidated** after mutations that affect dropdown data.
8. **UiModalComponent wraps all modal forms** — do not build custom modal shells.
9. **ConfirmationDialog handles all destructive confirmations** — do not build inline delete confirms.
10. **SharedModule must be imported** in any feature module that uses shared components.
