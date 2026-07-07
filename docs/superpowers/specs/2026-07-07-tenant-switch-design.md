# Tenant Switch Design

## Context

The old project provides tenant switching from the user avatar dropdown. The new project already has the backend API wrapper, `searchTenant` state, and request header injection, but it does not expose the switch UI.

The backend API contract must stay unchanged.

## Old Behavior To Preserve

- Show the switch entry only when the current user belongs to the system tenant: `tenantId === sysTenantId`.
- Open a tenant switch modal from the avatar dropdown.
- Search tenants through `/webapi/config/tenant/select` with `{ tenantName, limit: 20 }`.
- Use `name` as the option label and `id` as the option value.
- Save the selected tenant through `userStore.setSearchTenant(...)`.
- Refresh the current page after switching.
- Send the selected tenant through the request header configured by `dataHeaderTenant`, currently `schemasTenantId`.
- Preserve the selected tenant across browser refreshes.

Although the old modal configured `multiple: true`, the old request interceptor only wrote the header when the selected value was a string or number. The effective behavior is therefore a single tenant ID.

## Proposed New Behavior

Add a new tenant switch item to the existing Vben `UserDropdown` menu in `apps/web-antd/src/layouts/basic.vue`.

The menu item is visible only when:

- the app is in multi-tenant mode, and
- the logged-in user tenant is the system tenant.

Clicking the menu item opens an app-local tenant switch modal. The modal uses the existing tenant select API, supports remote search with debounce, and stores one tenant ID.

On confirm, the modal:

- writes the tenant ID to `userStore.searchTenant`,
- persists that value through the user store, and
- refreshes the current route so visible data reloads with the tenant header.

## Components

- `basic.vue`: adds the menu item, visibility condition, modal registration, and refresh handler.
- `TenantSwitchModal.vue`: encapsulates modal UI, remote tenant search, selection, confirm, and loading state.
- `user.ts` store: persists `searchTenant` so browser refresh keeps the active tenant.

## Data Flow

1. System tenant user opens avatar dropdown.
2. User clicks `切换租户`.
3. Modal searches tenants with `doTenantSelect({ tenantName, limit: 20 })`.
4. User selects one tenant.
5. Confirm calls `setSearchTenant(selectedTenantId)`.
6. Current route refreshes.
7. Request interceptor writes `headers.schemasTenantId = userStore.searchTenant` on eligible requests.

## Error Handling

- Empty selection is treated as clearing the switched tenant.
- API search failures use the existing request error handling.
- Confirm disables while saving or refreshing to prevent duplicate submits.

## Testing

- Add focused store tests for `setSearchTenant` and persisted state configuration.
- Add a small tenant option normalization test if the modal needs a helper.
- Run typecheck and targeted eslint.
- Use `agent-browser-cli` to verify the avatar menu entry and modal behavior in the running app.
