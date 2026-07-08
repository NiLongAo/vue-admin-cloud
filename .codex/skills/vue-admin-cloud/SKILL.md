---
name: vue-admin-cloud
description: Use when working in F:/work/vue/Autonomy/vue-admin-cloud, especially Vben Admin 5.x Vue features, monorepo structure, apps/web-antd routes, backend menus, request APIs, tenant behavior, stores, forms, VXE tables, Ant Design Vue UI, profile pages, browser checks, or vue-vben-admin architecture comparisons.
---

# Vue Admin Cloud

## Core Rule

This project is a customized Vben Admin 5.7.0 monorepo. Read the project-specific reference before changing business code, because upstream Vben patterns and local backend/menu/tenant conventions are both active.

## Start Here

1. Identify the task type below.
2. Read only the matching reference files.
3. Search the nearest existing implementation with `rg`.
4. Implement using `apps/web-antd` adapters and local domain patterns.
5. Run targeted tests/typecheck and browser verification when UI is touched.

## Reference Map

| Task | Read |
|---|---|
| Understand repo layout, aliases, upstream relationship | `references/architecture.md` |
| Add or fix route, menu, permission, sidebar, personal center | `references/routing-menus-access.md` |
| Add or fix API, auth, token refresh, tenant header, user/system store | `references/api-auth-tenant.md` |
| Build or fix forms, tables, modals, uploads, responsive UI | `references/ui-forms-tables.md` |
| Work on tenant, profile, workspace, system, video, OA, flow features | `references/domain-features.md` |
| Use project commands, `rg`, pnpm, vitest, eslint, typecheck, browser CLI | `references/tools.md` |
| Implement a normal list page or CRUD page | `workflows/crud-page.md` and `examples/list-page-pattern.md` |
| Implement a form modal | `workflows/crud-page.md` and `examples/form-modal-pattern.md` |
| Fix a bug or warning | `workflows/debugging.md` |
| Verify before finishing | `workflows/verification.md` and `checklists/final-review.md` |
| Work on profile or tenant switching | `examples/profile-tenant-patterns.md` |

## Non-Negotiables

- Never put `.test.ts` files under `apps/web-antd/src/router/routes/modules`; that glob eagerly imports all route module `.ts` files.
- Use `#/adapter/form` and `#/adapter/vxe-table`; do not import raw upstream form/table hooks directly in business pages.
- Use `requestClient` for normal backend APIs; use `baseRequestClient` only for login/refresh responses that need the raw wrapper.
- Preserve tenant behavior: `useUserStore().searchTenant` becomes the `schemasTenantId` request header unless a request sets `dataHeaderTenant: false`.
- For AntD `Upload`, always keep stable file `uid` values.
- For full-height list pages, prefer `<Page auto-content-height>` and grid `height: 'auto'`.
- Use `agent-browser-cli` for runtime UI checks after frontend changes.

## Validation

Run the bundled skill validation after editing this skill:

```bash
node .codex/skills/vue-admin-cloud/scripts/validate-skill.mjs
```
