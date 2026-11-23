# Illinois Claude theme

A Claude plugin (mod) that sets a UIUC-branded theme via `$.theme.set` at session start. Built for Jason Mock, Gies Teaching & Learning.

- Theme code: `hooks/register.ts`. Colors go through `makeColors` in `hooks/make-colors.js`; don't hand-write color keys. Re-copy make-colors.js from the plugin-authoring skill when the Claude build updates, then rerun `claude plugin validate .` and check `problems` has no "Desktop won't paint" line.
- Keep body, secondary and muted text at WCAG AA (4.5:1) in both modes.
- Themes only draw in the desktop/mobile apps (not project threads or the terminal). The `theme_status` tool reports `isDrawn` and its reason.
- Bump `version` in plugin.json for each change so installs pick it up with `claude plugin update`.
- No personal or institutional data belongs here.
