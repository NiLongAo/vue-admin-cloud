# Final Review Checklist

- No unrelated user changes reverted.
- No tests placed under `apps/web-antd/src/router/routes/modules`.
- APIs use `requestClient` unless raw wrapper handling requires `baseRequestClient`.
- Tenant behavior preserved; `dataHeaderTenant: false` used only intentionally.
- Forms use `#/adapter/form`.
- Tables use `#/adapter/vxe-table`.
- Upload file list items include stable `uid`.
- Full-height table pages use `Page auto-content-height` and grid `height: 'auto'`.
- Permissioned buttons/actions use `v-access` or `hasAccessByCodes`.
- Profile/avatar/menu entries still share `/work/personal` when personal center is touched.
- Targeted tests or typecheck/lint were run, or inability to run is reported.
- UI changes were checked with `agent-browser-cli`, including console warnings/errors.
- Skill edits pass `node .codex/skills/vue-admin-cloud/scripts/validate-skill.mjs`.
