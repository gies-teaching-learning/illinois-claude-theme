# Illinois theme

A University of Illinois Urbana-Champaign look for the Claude desktop and mobile apps, built from the official brand palette at brand.illinois.edu. Light mode uses Illini Blue text on white and cool-gray surfaces with Altgeld orange as the accent; dark mode is a deep Illini Blue night with Illini Orange accents. Your own messages sit in an Illini Blue bubble with an orange edge. Core text colors meet WCAG AA (4.5:1) in both modes. Behind the chat is a quiet tiled version of the Illinois finial brand pattern (brand.illinois.edu `--il-pattern-finial`), redrawn as vector lines that follow light and dark mode. It applies when a session starts; nothing to configure.

To get a new version after it's pushed: `claude plugin update illinois-theme@gies-tl`, then `/reload-plugins` or start a new session.

## Install

The repository is private, so your computer needs a GitHub sign-in for git first (for example `gh auth login`, then `gh auth setup-git`).

In a Claude Code terminal session:

```
/plugin install illinois-theme --marketplace gies-teaching-learning/illinois-claude-theme
```

Answer `y` to add the marketplace, then press Enter for the user scope. From a shell instead:

```
claude plugin install illinois-theme --marketplace gies-teaching-learning/illinois-claude-theme
```

In the Claude desktop app: click **+** next to the prompt box, choose **Plugins**, **Add marketplace** with `gies-teaching-learning/illinois-claude-theme`, then **Add plugin**.

## Colors

From brand.illinois.edu: Illini Orange #FF5F05, Illini Blue #13294B, Altgeld #C84113, Industrial #1D58A7, Prairie #006230, Harvest #FCB316, Storm 95 #F4F4F4, Storm 80 #C6C7C6.

## Files

| File | What it is |
| --- | --- |
| `.claude-plugin/plugin.json` | Plugin manifest |
| `.claude-plugin/marketplace.json` | Makes this repo installable as a marketplace |
| `hooks/register.ts` | The theme: colors, message style, and a `theme_status` diagnostic tool |
| `hooks/make-colors.js` | Claude's palette builder, copied unchanged from the plugin-authoring skill |
