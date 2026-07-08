# Architecture Reference

## Upstream Relationship

The root `package.json` identifies this repo as `vben-admin-monorepo` version `5.7.0` and points to `https://github.com/vbenjs/vue-vben-admin`. Treat upstream `vbenjs/vue-vben-admin` 5.x as the base architecture, then prefer local code for actual behavior.

Common upstream shape used here:

- `apps/*`: runnable applications. The active business app is `apps/web-antd`.
- `packages/*`: shared packages exposed as `@vben/*`.
- `packages/@core/*`: core UI/base/composable infrastructure.
- `packages/effects/*`: access, request, layouts, plugins, common UI.
- `internal/*`: shared build/lint/vite/turbo/node tooling.
- `scripts/*`: monorepo helper commands.

## Workspace And Tooling

Important files:

- `pnpm-workspace.yaml`: includes `internal/*`, `packages/*`, `packages/@core/*`, `packages/effects/*`, `packages/business/*`, `apps/*`, `scripts/*`, `docs`, `playground`.
- `package.json`: pnpm 11, Node `^22.18.0 || ^24.0.0`, turbo, Vite, Vue 3, TypeScript.
- `turbo.json`: `dev` is persistent and uncached; `typecheck` has no outputs; builds depend on package builds.
- `internal/lint-configs/.../ignores.ts` and `oxfmt.config.ts`: ignore `.codex`, so validate skill files with the bundled script instead of relying on repo lint/format.

## Main App

`apps/web-antd` is the Ant Design Vue app. Source layout:

| Folder | Usage |
|---|---|
| `src/main.ts` | Initializes preferences namespace, then imports `bootstrap`. |
| `src/bootstrap.ts` | Initializes component adapter, form adapter, app, i18n, stores, directives, router, motion, title, socket. |
| `src/adapter` | Local adapter layer for component, form, VXE table. Business code should use these. |
| `src/api` | Domain API wrappers. Keep backend endpoint details here. |
| `src/router` | Router, guards, static route modules, dynamic access generation. |
| `src/layouts` | Basic layout, tenant switch modal, app shell slots. |
| `src/store` | App-local stores, including auth and system configuration. |
| `src/views` | Business pages and `_core` internal pages. Backend menu component strings map here. |
| `src/components` | App-local reusable components such as video and flowchart components. |
| `src/hooks` | Socket and domain hooks. |
| `src/locales` | Local i18n resources. |

## Boot Flow

1. `main.ts` builds a namespace from `VITE_APP_NAMESPACE`, `VITE_APP_VERSION`, and `prod/dev`.
2. `initPreferences` is called with local overrides and extension.
3. `bootstrap(namespace)` runs.
4. `bootstrap.ts` initializes:
   - component adapter: `initComponentAdapter()`
   - form adapter: `initSetupVbenForm()`
   - Vue app
   - loading directive
   - i18n
   - Pinia stores with namespace
   - access directive
   - tippy
   - router
   - motion plugin
   - dynamic title
   - socket init

## Aliases And Imports

Common imports:

- `#/...`: app source alias for `apps/web-antd/src`.
- `@vben/common-ui`: shared Vben UI wrappers and primitives.
- `@vben/layouts`: layout widgets such as user dropdown, lock screen, notification.
- `@vben/stores`: shared Pinia stores, including `useUserStore` and `useAccessStore`.
- `@vben/access`: permission helpers and directive.
- `@vben/request`: request client infrastructure.
- `@vben/plugins/vxe-table`: VXE integration, normally accessed through `#/adapter/vxe-table`.

## Existing Feature Areas

- Dashboard: `views/dashboard/analytics`, `views/dashboard/workspace`.
- Work: `views/work/personal`, `views/work/oa`, `views/work/leave`.
- System: `views/index/system/*` for user, tenant, role, menu, dictionary, config, department, position, SMS, OAuth.
- Video: `views/video/*` and `components/Video`.
- OA: `views/oa/*`, `api/oa/*`.
- Flow/FS: `views/fs/*`, `components/FlowChart`.

## Encoding Note

Some existing Chinese comments/text may display as mojibake in PowerShell output. Do not mass-normalize existing files unless the user explicitly asks. For skill files, keep ASCII to avoid this issue.
