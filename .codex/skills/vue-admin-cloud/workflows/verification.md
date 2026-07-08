# Verification Workflow

Use this before claiming a project change is complete.

## Choose Commands By Change Type

Skill-only edits:

```bash
node .codex/skills/vue-admin-cloud/scripts/validate-skill.mjs
```

Helper/data mapping:

```bash
pnpm exec vitest run <test-file> --dom
```

Frontend page/component:

```bash
pnpm exec eslint <changed-files>
pnpm -F @vben/web-antd run typecheck
```

Shared package:

```bash
pnpm exec vitest run <package-test-files> --dom
pnpm run check:type
```

UI runtime:

```bash
agent-browser-cli open http://localhost:5666/<path>
agent-browser-cli scan --text-only
agent-browser-cli console start --tab <tabId>
agent-browser-cli console list --tab <tabId> --level warning
agent-browser-cli console list --tab <tabId> --level error
agent-browser-cli console stop --tab <tabId>
```

## Evidence To Report

Report command names and actual result:

- test file count and pass count when visible
- typecheck exit status
- eslint exit status
- browser warning/error count
- any command that could not run and why

Do not claim full project health from a narrow command.

## Common Targeted Commands

```bash
pnpm exec vitest run apps/web-antd/src/views/_core/profile/profile-user.test.ts --dom
pnpm exec vitest run apps/web-antd/src/layouts/modules/tenant-switch.test.ts --dom
pnpm exec vitest run packages/@core/preferences/__tests__/preferences.test.ts --dom
pnpm exec eslint apps/web-antd/src/views/_core/profile/index.vue apps/web-antd/src/views/_core/profile/profile-user.ts
pnpm -F @vben/web-antd run typecheck
```

## Browser Pages To Check

- Workspace: `http://localhost:5666/dashboard/workspace`
- Personal center: `http://localhost:5666/work/personal`
- Tenant list: `http://localhost:5666/index/system/tenant` if backend menu route exists in current session

When a page is backend-menu controlled, navigate through the app menu or open the resolved route that exists in the running router.
