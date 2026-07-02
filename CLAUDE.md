# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal portfolio site (Aimee Venturina) served by a tiny Flask backend, with a single Jinja template and static assets (no build step, no bundler, no frontend framework). Bootstrap 5 and fonts are pulled from CDN links in `templates/index.html`.

## Commands

Run the dev server (from the repo root, `/Users/aimeeventurina/github/aimee-venturina-portfolio`):

```bash
source .venv/bin/activate
flask --app server run --debug
```

`server.py` has no `if __name__ == "__main__":` / `app.run()` block, so `python3 server.py` does nothing — it must be run via the `flask` CLI as above. Dependencies are declared in `requirements.txt` (just `Flask`); install with `pip install -r requirements.txt` inside `.venv`.

There are no automated tests, linters, or build scripts in this repo.

## Architecture

- `server.py` — Flask app with two routes:
  - `GET /` renders `templates/index.html` (no Jinja templating is actually used inside it — it's static HTML served through `render_template`).
  - `POST /submit_form` handles the contact form and appends a `timestamp,email,name,message` row to `database.csv` via `write_to_csv()` (uses Python's `csv` module). This is the only server-side logic in the project — there's no database, ORM, or validation layer. There's also an unused `write_to_file()` helper that writes `email,name,message` lines to `database.txt` — it's dead code, not currently called by any route.
- `templates/index.html` — the entire page (nav, header, about, portfolio, contact, footer, and the project modal markup) in one file. Sections are plain anchor-linked (`#about`, `#portfolio`, `#contact`) with Bootstrap 5 scrollspy wired up via `data-bs-spy="scroll"` on `<body>`.
- `static/js/portfolio.js` — vanilla JS (no framework) that:
  - Fetches `static/js/projects.json` on `DOMContentLoaded` and renders portfolio cards into `#portfolioGrid`.
  - Handles category filtering via `data-filter` attributes on the filter links.
  - Uses event delegation (`document.addEventListener("click", ...)`) to open a Bootstrap modal (`#projectModal`) with project details when a `.portfolio-link` is clicked, rather than binding per-card listeners.
- `static/js/projects.json` — the single source of truth for portfolio content (title, description, tech stack, category, image filenames, repo/demo links). Image paths are built at runtime by joining `imageBase` with each project's `thumbnail`/`image` field. To add or edit a project, edit this file — no HTML changes needed since cards are generated from it.
- `static/css/style.css` — all custom styling, organized into clearly commented sections (NAVIGATION, HERO/HEADER, SECTION LAYOUT, PORTFOLIO GRID, PROJECT MODAL, RESPONSIVE MODAL, etc.). Responsive overrides live in `@media` blocks placed directly after the section they adjust, rather than in one global media query block at the end.
- `static/img/portfolio/` — project thumbnails/images named `NN-small.jpg` / `NN-large.jpg`, matched to the `id` field in `projects.json`.

## Notes for future changes

- The project modal (`#projectModal` in `templates/index.html`, styled in the "PROJECT MODAL" / "RESPONSIVE MODAL" sections of `style.css`) has been a recurring source of small-screen layout bugs (centering, overflow). When touching it, check both the base `#projectModal .modal-dialog` rule and the `@media (max-width: 576px)` override together — they interact via CSS cascade (the media query only overrides specific properties, so unset ones fall through from the base rule).
- `database.csv` is a real data file, not a fixture — avoid overwriting or truncating it. Note: unlike `database.txt`, it is **not** currently listed in `.gitignore` — worth adding if this repo is ever put under version control, since it accumulates real visitor submissions.
- **Deployment target is PythonAnywhere free plan.** Pending task: send a notification email (to aimeeventurina@gmail.com, with the submitted email/name/message) when `/submit_form` is hit. Free PythonAnywhere accounts block outbound SMTP entirely (only HTTPS to a whitelist of domains is allowed), so plain `smtplib` + Gmail will silently fail once deployed even though it works locally. The viable approach on this plan is an HTTPS-based transactional email API (e.g. SendGrid's Mail Send API via `requests`, since `api.sendgrid.com` is whitelisted) rather than raw SMTP. Not yet implemented — revisit `submit_form()`/`write_to_csv()` in `server.py` when picking this up.
