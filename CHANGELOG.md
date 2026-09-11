# Changelog

## Unreleased

### GC Design System v1 migration

- Moved from the deprecated alpha packages to the stable release:
  - `@cdssnc/gcds-components@0.42.0` -> `@gcds-core/components@1.6.0`
  - `@gcds-core/css-shortcuts@1.0.1` -> `1.2.0`
  - CDN host `cdn.design-system.alpha.canada.ca` -> `cdn.design-system.canada.ca`
- Applied the v1 API changes: `gcds-container` `layout="page"` and `alignment`, `gcds-top-nav` `alignment="end"`, `gcds-notice` `notice-role`, `gcds-text` `size="small"`; removed `signature-variant` and `fieldset-id`.
- Dropped `tag="main"` from containers, leaving one `main` landmark per page.
- Dropped `async` from the components script so elements register before first paint.

### Fixes

- Header skip link pointed at `#`; `main` now carries `id="main-content"`.
- Body text used the removed `--gcds-color-grayscale-1000`; now `--gcds-text-primary`.
- Hero heading rendered dark on the dark panel; now `heading-role="light"` (contrast 1.4:1 -> 17.9:1).
- Hero's full-bleed strip used a raw palette token that v1 darkened, leaving a visible seam; now `--gcds-bg-primary`.
- Table of contents fieldset lost its padding when `fieldset-id` was removed; now keys off a `toc` class.
- Pages without a `title` rendered an empty `h1`; an untitled home page falls back to the site title.
- Removed the home page page-list and the list template's `.Render "summary"` calls; with no `summary` view template they had always rendered nothing.

### Developer experience

- `dev.sh` and the VS Code dev server task now serve `exampleSite` against the working tree. They previously ran Hugo in the repository root, which has no content or configuration, so every page rendered empty.
- `.gitlab-ci.yml` builds `exampleSite` as a check instead of deploying. The `pages` job published that same empty site; the theme is consumed as a Hugo module, so nothing needs publishing. Also dropped the unused `npm install` and added workflow rules to avoid duplicate pipelines.
- Pinned Hugo 0.161.1 in CI and `theme.toml`. The previous 0.126.3 cannot build the theme at all.
- The exampleSite sets `footer_display = "full"` so the complete Government of Canada footer is shown.

### Housekeeping

- Updated `static/gcds-design-system.html` for v1: `gcds-checkboxes`/`gcds-radios`, valid icon names and sizes, `card-title-tag`, `link-role`, `maxlength`. Dropped the removed `gcds-verify-banner` and `gcds-phase-banner` sections plus the Font Awesome kit and duplicate font links; added notice, signature and language toggle examples.
- Removed the unused `.bg-light-blue` rule and the inert `color` on `.pilcrow`.
- Pointed documentation links and `theme.toml` at the production design system site.

## v0.3.0

### Multilingual Improvements

- Improved support for multilingual site configurations.
- Added validation to ensure pages have corresponding translations (checks matching `translationKey` in front matter).
- Splash page support when landing at the site root or when hosting environments (e.g., GitHub Pages) do not support domain-based language selection.
- Added full layouts and background image support for splash page (splash page now functional).

### Layout & Rendering

- Added additional layout components.
- Updated content format and layout structure for better consistency.
- Added margin to the bottom of tables via table render hook.
- Improved fenced code blocks and tables to respect the configured `characterLimit` width.
- Enhanced inline code block rendering with background styling.
- Enabled Markdown attributes on block elements.
- Implemented table render hook for standardized table formatting.

### Shortcodes & Content Standards

- Added standardized shortcodes to improve consistency across sites.
- Added validation to ensure no `needs-review` shortcodes remain in published content.
- Added automated content checks via additional GitHub Action.

### Configuration & Defaults

- Enabled additional Hugo functionality by default:
  - Emoji support  
  - Markdown Attributes  
  - Automatic "date modified" from Git  
- Updated permalink configuration to avoid deprecated `slugorfilename` usage.
- Fixed menus to properly reflect pages present in `exampleSite`.

## v0.2.4

- Switch from gcds-utility to gcds-css-shortcuts to reflect the rename from GC Design System.

## v0.2.3

- Added dynamic language and language direction rendering to themes base layout

## v0.2.2

- All Pilcrow functionality to headers
- Add markdownlint-cli2

## v0.2.1

- Updates GC Design System to 0.42.0
- Added a global style for handling blockquotes

## v0.2.0

- Align character-limit with GC Design System recommendations by default.

  To remove the character limit, set `disableCharacterlimit` to `true`
  on a page's params or globally with the site's params.

## v0.1.1

### Fixed

- "head-end" and "body-end" hooks were not called.

## v0.1.0

- Updates GC Design System to 0.41.0
- Use the GC Design System Utility from the CDN instead of from the
  documentation site
- Removes the current page from the breadcrumb to align with
  <https://design.canada.ca/common-design-patterns/breadcrumb-trail.html>
- Adds an "alert" shortcode for displaying alerts.
- Add hooks for "head-end" and "body-end" to allow implementations to
  inject additional resources at the end of the `<head>` and `<body>`
  sections.
- Menu parameters is now used to setup the `home` slot, which resolves
  issues when the site was not hosted at the root url.
- Footer now defaults to full-sized footer, and adds a site param for
  changing the footer mode (e.g., `footer_display = "compact"`).
- Uses a menu to setup the footer contextual links to maintain the order
  of entries (JSON/YAML data was sorted by key name).
- Switches the date displayed to be the `Lastmod` date of the content,
  which uses the Git commit date the content was last changed.
- Implements a "Canada.ca" style menu system by using the sub-pages
  Title and Description on a list page. This new menu is disabled when
  the sidebar is enabled (as it is redundant).
- Adds a flag for showing the Alpha notice.
- A few other minor cleanup/tweaks to fix issues with a rendered site.
