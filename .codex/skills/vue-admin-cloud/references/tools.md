# Tools And Commands

## Search

Use `rg` first:

```bash
rg -n "useVbenVxeGrid|Page auto-content-height" apps/web-antd/src
rg -n "schemasTenantId|dataHeaderTenant|searchTenant" apps/web-antd/src packages
rg --files apps/web-antd/src/views/index/system
```

Useful searches:

- Route modules: `rg -n "path:|component:|redirect:" apps/web-antd/src/router`
- API endpoints: `rg -n "/webapi/" apps/web-antd/src/api`
- Permission codes: `rg -n "v-access|hasAccessByCodes" apps/web-antd/src/views`
- Upload file lists: `rg -n "fileList|uid|Upload" apps/web-antd/src`
- Full-height pages: `rg -n "auto-content-height|height: 'auto'|height: \\\"auto\\\"" apps/web-antd/src`

## Package Commands

Root scripts:

```bash
pnpm run dev:antd
pnpm run build:antd
pnpm run test:unit
pnpm run check:type
pnpm run lint
pnpm run format
```

Targeted commands:

```bash
pnpm exec vitest run <test-file> --dom
pnpm exec eslint <changed-files>
pnpm -F @vben/web-antd run typecheck
```

Use targeted commands during development, then broaden based on risk.

## Dev Server

Use:

```bash
pnpm run dev:antd
```

The local app commonly runs at:

```text
http://localhost:5666
```

If the server is already running, do not start another one on the same port. Use the existing page.

## Browser Verification With agent-browser-cli

Use this after UI changes. Start with target commands; do not run health checks first unless a target command fails.

Open and inspect:

```bash
agent-browser-cli open http://localhost:5666/dashboard/workspace
agent-browser-cli scan --text-only
agent-browser-cli snapshot --limit 200
```

Use returned tab id for follow-up:

```bash
agent-browser-cli scan --tab <tabId> --text-only
agent-browser-cli snapshot --tab <tabId> --limit 200
agent-browser-cli click --tab <tabId> '@e1'
agent-browser-cli fill --tab <tabId> '@e2' 'value'
```

Console checks:

```bash
agent-browser-cli console start --tab <tabId>
agent-browser-cli console list --tab <tabId> --level warning
agent-browser-cli console list --tab <tabId> --level error
agent-browser-cli console stop --tab <tabId>
```

Network checks:

```bash
agent-browser-cli network start --tab <tabId>
agent-browser-cli network list --tab <tabId> --filter webapi
agent-browser-cli network detail <requestId> --tab <tabId>
agent-browser-cli network stop --tab <tabId>
```

Screenshots:

```bash
agent-browser-cli screenshot --tab <tabId> --out F:/work/vue/Autonomy/vue-admin-cloud/tmp/page.png
agent-browser-cli screenshot --tab <tabId> --full-page --out F:/work/vue/Autonomy/vue-admin-cloud/tmp/full.png
```

Only run these when target commands fail or the user asks for diagnostics:

```bash
agent-browser-cli status
agent-browser-cli doctor
agent-browser-cli logs --tail 100
```

## Git Safety

Always check:

```bash
git status --short --untracked-files=all
```

Do not revert unrelated user changes. If a touched file has unexpected changes, read it and work with the current content.

This repo intentionally ignores most AI folders, but `.gitignore` allows `.codex/skills/vue-admin-cloud/**` so this project skill can be tracked.

## Skill Validation

Official `quick_validate.py` may fail if Python lacks `yaml`. Use the bundled Node validator:

```bash
node .codex/skills/vue-admin-cloud/scripts/validate-skill.mjs
```
