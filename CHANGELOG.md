# Changelog

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
  https://design.canada.ca/common-design-patterns/breadcrumb-trail.html
- Adds an "alert" shortcode for displaying alerts.
- Add hooks for "head-end" and "body-end" to allow implementations to
  inject additional resources at the end of the <head> and <body>
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
