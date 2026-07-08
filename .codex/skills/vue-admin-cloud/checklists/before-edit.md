# Before Edit Checklist

- Run `git status --short --untracked-files=all`.
- Identify whether the change is app-only, shared package, routing/menu, request/tenant, or UI layout.
- Read the matching reference file from this skill.
- Search nearest existing code with `rg`.
- Check if backend menu or static route owns navigation.
- Check if the page uses app adapters: `#/adapter/form`, `#/adapter/vxe-table`.
- Check whether tenant header should apply.
- For UI pages, inspect current behavior with `agent-browser-cli` when a dev server is available.
- Decide targeted verification commands before editing.
