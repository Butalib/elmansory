# Current Work Map

> Facts confirmed from source code inspection. Verify files before implementing.
> Unresolved decisions are explicitly marked.

---

## Orders

### Existing Implementation

**Module:** `src/app/modules/orders/orders-module.ts`  
**Routing:** `src/app/modules/orders/orders-routing-module.ts`
- `''` → `OrdersPage`
- `':id'` → `OrderDetailsPage`

**Key Files:**
| File | Status |
|---|---|
| `orders/pages/orders-page/orders-page.ts` | Full container — HybridQueryEngine, KPI, tabs, all event handlers |
| `orders/pages/orders-page/orders-page.html` | InnerActionHeader + KPI + filter tabs + GenericTable + ConfirmationDialog |
| `orders/pages/order-details-page/order-details-page.ts` | Loads `IOrderDetails` by route param via `ordersService.getOrderDetails(id)` |
| `orders/pages/order-details-page/order-details-page.html` | Renders `OrderCustomerInfo` + `OrderItems` + Accept/Reject buttons |
| `orders/components/order-customer-info/order-customer-info.ts` | Presentation — customer fields + avatar. Input: `order: IOrderDetails` |
| `orders/components/order-items/order-items.ts` | Presentation — items list, totals, discount. Input: `order: IOrderDetails` |
| `orders/components/orders-details/orders-details.ts` | **Empty shell** — renders placeholder text only |
| `orders/modal/order-confermation/order-confermation.ts` | **Empty shell** — renders placeholder text only |
| `core/service/orders.service.ts` | Extends `GenericCrudService<IOrder>`, adds `getOrderDetails(id)` |
| `core/interface/IOrder.ts` | `IOrder`, `IOrderItem`, `IOrderCustomer`, `IOrderDetails` |

**Interface shape (`IOrder`):** `id, orderCode, customerName, itemCount, createdAt, isActive, status ('pending'|'accepted'|'rejected'), customerAvatar, orderType ('ملازم'|'حجز الكترونى'|'جهز نفسك للمدرسة'), discount`

**Interface shape (`IOrderDetails extends IOrder`):** adds `customer: IOrderCustomer`, `items: IOrderItem[]`

**Reusable infrastructure already wired:**
- `HybridQueryEngine` — local mode, `service.items$` as source
- `InnerActionHeader` — search, sort, date range
- `GenericTable` — columns configured with edit/view/delete actions + toggle
- `ConfirmationDialog` — wired for "accept all pending" bulk action
- `KPI` stats derived from `service.items$`

### Confirmed Missing Functionality

- **`onActionClick('edit')` branch is absent** in `orders-page.ts`. The `'edit'` action is declared in `tableColumns` but `onActionClick()` only handles `'view'`. No edit modal exists.
- **`onActionClick('delete')` branch is empty** — the `else if (actionId === 'delete')` block has no body.
- **`isOrderDetailsModalOpen` flag is set** when `actionId === 'view'`, and `saveOrderDetails()` exists in the TS, but **there is no `app-modal-container` in `orders-page.html`** that uses this flag. The "view" action has no visible modal.
- **Accept/Reject buttons on `order-details-page.html`** have no `(click)` handlers — UI only.
- **`confirmAcceptAll()` uses a `setTimeout` mock** — no real `OrdersService` method is called.
- **`OrderConfermation` component** — declared in module, purpose unknown, body is empty.
- **`OrdersDetails` component** — declared in module, purpose unknown, body is empty.

### Known Bugs

- **Duplicate date filter block** in `orders-page.ts`: The date-range filter logic (lines 93–101) is copy-pasted twice in `filterLocally()`. No functional impact but should be fixed.

### Unresolved Decisions

- Does the "edit" flow open a modal on the list page or navigate to a separate edit page?
- What fields are editable on an order? (Currently only `discount` is patched via `saveOrderDetails`)
- What does `OrderConfermation` represent — is it distinct from the existing `ConfirmationDialog` or a duplicate?
- What does `OrdersDetails` represent — is it a modal details view or the same as `OrderDetailsPage`?
- Should "accept all" call a real bulk API endpoint, or patch each pending order individually?

---

## Students

### Existing Implementation

**Module:** `src/app/modules/users/students/students-module.ts`  
**Routing:** `src/app/modules/users/students/students-routing-module.ts`
- `''` → `StudentsPage`
- `':id'` → `StudentsModal` ← **BUG: should route to `StudentDetails`**

**Key Files:**
| File | Status |
|---|---|
| `students/students-page/students-page.ts` | Full container — HybridQueryEngine, add/edit/delete/toggle, navigate to details |
| `students/students-page/students-page.html` | Full template (verify before editing) |
| `students/students-modal/students-modal.ts` | Full add/edit modal with FormGroup + avatar upload |
| `students/students-modal/students-modal.html` | UiModalComponent + UiImageUpload + UiInput + UiPopupSelect + BtnSwitch |
| `students/student-details/student-details.ts` | **Empty shell** — renders `<p>student-details works!</p>` |
| `students/student-details/student-details.html` | **`<p>student-details works!</p>`** only |
| `core/service/students.service.ts` | Extends `GenericCrudService<IStudent>` — no extra methods |
| `core/interface/IStudent.ts` | See shape below |

**Interface shape (`IStudent`):** `id, name, phone, birthDate, joinDate, isActive, levelId?, levelName?, avatar?, ordersCount, wheelUses`

**StudentsModal form fields:** `id, name, phone, levelId, birthDate, joinDate, isActive` + file avatar via `UiImageUploadComponent`

**Reusable infrastructure already wired:**
- `HybridQueryEngine` — local mode, filters by `searchTerm` (name/phone/levelName) and date range (joinDate)
- `LookupService.getOptions('levels', 'subLevel')` — loaded into `levelsList`
- `ConfirmationDialog` — wired for delete flow
- `StudentsPage.onSaveStudent()` — branches add vs edit, calls service, closes modal

### Confirmed Missing Functionality

- **`StudentDetails` component** — component exists and is declared, but body is empty. No data is fetched, nothing is displayed.
- **Student-related orders/products** — `IStudent` has `ordersCount` (a number) but no `orders` array. `StudentsService` has no method to fetch orders by student. No display component exists.

### Known Bugs

- **Routing bug:** `students-routing-module.ts` maps `':id'` to `StudentsModal` instead of `StudentDetails`. The path `router.navigate(['/users/students/details', id])` called in `StudentsPage.onTableActionClick('view')` will load the add/edit modal at that URL instead of the details page.

### Unresolved Decisions

- What should the student details page display beyond basic student fields?
- Are student-related "orders" the same `IOrderDetails` shape, or a different model?
- Are student-related "products" the items within those orders, or separate product records?
- Does `StudentsService` need a `getStudentDetails(id)` method returning an extended interface, or should the page compose data from multiple service calls?

---

## Conversations

### Existing Implementation

**Module:** `src/app/modules/conversations/conversations-module.ts`  
**Routing:** `src/app/modules/conversations/conversations-routing-module.ts`

Both files are empty shells:
- `ConversationsModule` — `declarations: []`, no components
- `ConversationsRoutingModule` — `routes: []`, no routes

The sidebar entry ("المحادثات", route `conversations`) exists in `LayoutServices.menuItems` and lazy-loads `ConversationsModule`. Navigation to `/conversations` succeeds but renders nothing.

**No service, no interface, no component, no db.json model exists for conversations.**

### Confirmed Missing Functionality

Everything:
- Conversation list component
- Conversation selection / active conversation state
- Chat message display component
- Text message send
- Image attachment in chat
- Video attachment with 5 MB limit enforcement
- Voice recording

### Infrastructure Available for Reuse

| Requirement | Available | Path |
|---|---|---|
| HTTP send | `ApiDataService.post()` | `core/service/data/api.data.service.ts` |
| Image attachment | `UiImageUploadComponent` (Base64, images only) | `shared/kit/model/ui-image-upload-component/` |
| Modal shell | `UiModalComponent` | `shared/kit/model/ui-modal-component/` |
| Generic CRUD | `GenericCrudService` | `core/service/data/generic-crud.service.ts` |

### Known Gaps in Infrastructure

- `UiImageUploadComponent` only accepts images (`file.type.startsWith('image/')`). It cannot handle video or audio.
- No file size validation exists anywhere in the codebase.
- No voice recording infrastructure (no MediaRecorder usage, no audio library in `package.json`).
- No `conversations` or `messages` key in `db.json`.

### Unresolved Decisions

- **Data model:** What is the shape of a conversation? What is the shape of a message? What fields does each have?
- **Backend:** Does `db.json` need new top-level keys (`conversations`, `messages`) before work starts?
- **Active conversation state:** Signal on page component vs. route parameter vs. injectable service?
- **Video upload mechanism:** `UiImageUploadComponent` uses Base64 (impractical for 5 MB video). Alternatives: extend to emit raw `File`, use `FormData` multipart, or build a separate `UiFileUploadComponent`. Backend must match chosen approach.
- **Voice recording:** Native `MediaRecorder` API vs. third-party library. No library currently in `package.json`.
- **Message polling vs. real-time:** json-server does not support WebSockets. Polling interval or SSE must be decided if real-time is required.

---

## Products

### Existing Implementation

**Module:** `src/app/modules/products/products-module.ts`  
**Routing:** `src/app/modules/products/products-routing-module.ts`

Both files are empty shells:
- `ProductsModule` — `declarations: []`, no components
- `ProductsRoutingModule` — `routes: []`, no routes

The sidebar entry ("المنتجات", route `products`) exists in `LayoutServices.menuItems`.

**No service, no interface, no component exists for products.**

**Closest existing product shape** is `IOrderItem` in `core/interface/IOrder.ts`:
```ts
{ id, name, image, quantity, price, type }
```
This is embedded in orders and does not represent a standalone product entity.

### Confirmed Missing Functionality

Everything:
- Product list page
- Product service
- Product interface / type architecture
- Product form
- Stationery-specific form behavior
- Dynamic FormArray usage

### Infrastructure Available for Reuse

| Requirement | Available | Path |
|---|---|---|
| CRUD base | `GenericCrudService` | `core/service/data/generic-crud.service.ts` |
| Query/list | `HybridQueryEngine` + `GenericTable` | Standard pattern |
| Modal shell | `UiModalComponent` | `shared/kit/model/ui-modal-component/` |
| Image upload | `UiImageUploadComponent` | `shared/kit/model/ui-image-upload-component/` |
| Cascading/conditional fields | `ReservationModel` pattern | `reservation/reservation-model/reservation-model.ts` |
| Lookup dropdowns | `LookupService` + `UiPopupSelect` | `core/service/lookup.service.ts` |

**No FormArray usage exists anywhere in the codebase.** Angular `ReactiveFormsModule` is imported and available.

### Known Gaps in Infrastructure

- No `IProduct` interface.
- No `ProductsService`.
- No `products` key in `db.json`.
- No established FormArray pattern to reference.

### Unresolved Decisions

- **Product type architecture:** What are the product types? Is stationery one type? What fields are type-specific vs. shared?
- **Stationery-specific behavior:** What makes a stationery product form different? What additional fields does it require?
- **FormArray:** What does the array represent — kit items, size variants, pricing tiers, something else?
- **Product vs. OrderItem relationship:** Are products a standalone catalog that orders reference, or are they always created in the context of an order?
- **CRUD scope:** Is the products feature read-only (view catalog) or full CRUD (create/edit/delete products)?

---

## Cross-Feature Issues

### Confirmed Issues Found in Source

1. **Students routing bug** (`students-routing-module.ts`): `':id'` maps to `StudentsModal` instead of `StudentDetails`. The `router.navigate` call in `StudentsPage` targets a path that renders the add/edit form.

2. **Orders `onActionClick()` split** (`orders-page.ts`): Two methods exist — `onActionClicked()` (header button) and `onActionClick()` (table). The table handler has no `'edit'` branch and an empty `'delete'` branch.

3. **Orders detail modal state is unreachable** (`orders-page.ts`): `isOrderDetailsModalOpen` is set to `true` in code, but no `app-modal-container` in `orders-page.html` reads this flag. `saveOrderDetails()` exists but cannot be triggered from the template.

4. **Duplicate filter block** (`orders-page.ts`): The date-range filter inside `filterLocally()` is copy-pasted twice (lines ~93–104).

5. **`HybridQueryEngine` default limit is 7** (`hybrid-query-engine.service.ts` line 14): Default `{ _page: 1, _limit: 7 }`. Consumers override inconsistently — verify per feature.

6. **`UiImageUploadComponent` is images-only**: Any feature requiring file, video, or audio upload cannot reuse it without modification.

### Patterns Confirmed Working (Safe to Replicate)

- **Full CRUD page pattern:** `TeacherPage` + `TeachersModal` — `modules/users/teachers/`
- **Full CRUD with image upload:** `SlidersPage` + `SlideModel` — `modules/sliders/`
- **Cascading dropdown form:** `ReservationModel` — `modules/reservation/reservation-model/`
- **Delete with confirmation:** `StudentsPage.confirmDelete()` + `ConfirmationDialog`
- **KPI derived from `items$`:** `OrdersPage` — `map()` pipe on `service.items$`
- **Lookup loading in `ngOnInit`:** `TeacherPage.loadInitialLookups()` — `LookupService.getOptions()`
