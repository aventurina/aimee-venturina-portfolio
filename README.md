# Aimee Venturina — Portfolio

A personal portfolio website built with a lightweight Flask backend, static HTML/CSS/JS, and Bootstrap 5 — no build step, no bundler, no frontend framework.

## Features

- Single-page layout with scrollspy navigation (About, Portfolio, Contact)
- Portfolio grid rendered dynamically from `static/js/projects.json`, with category filtering and a Bootstrap modal for project details
- Contact form that writes submissions to a local CSV file

## Tech stack

- [Flask](https://flask.palletsprojects.com/) (Python)
- [Bootstrap 5](https://getbootstrap.com/) (via CDN)
- Vanilla JavaScript (no framework)

## Project structure

```
server.py                  # Flask app: routes for "/" and "/submit_form"
templates/index.html       # Entire page markup (nav, hero, about, portfolio, contact, modal)
static/css/style.css       # All custom styles, organized by section
static/js/portfolio.js     # Renders portfolio cards, handles filtering + modal
static/js/projects.json    # Source of truth for portfolio content
static/img/                # Site and portfolio images
database.csv               # Contact form submissions (gitignored)
```

## Getting started

### Prerequisites

- Python 3
- pip

### Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run the dev server

```bash
source .venv/bin/activate
flask --app server run --debug
```

Then open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

> **Note:** `server.py` has no `if __name__ == "__main__":` block, so it must be run via the `flask` CLI as shown above — `python3 server.py` will not start the server.

## Editing content

- **Portfolio projects** — edit `static/js/projects.json`. Cards are generated at runtime, so no HTML changes are needed to add, remove, or update a project. Add matching images to `static/img/portfolio/` as `NN-small.jpg` / `NN-large.jpg`, where `NN` matches the project's `id`.
- **Page copy / structure** — edit `templates/index.html` directly.
- **Styling** — edit `static/css/style.css`, which is organized into commented sections (navigation, hero, layout, portfolio grid, modal, responsive overrides).

## Contact form

Submissions to `/submit_form` are appended to `database.csv` (timestamp, email, name, message). This file is gitignored and is not a fixture — avoid deleting or truncating it.

Sending an email notification on submission (via an HTTPS-based email API, since the target host blocks outbound SMTP) is a planned enhancement, not yet implemented.

## Deployment

Target platform: [PythonAnywhere](https://www.pythonanywhere.com/) (free tier).

## License

All rights reserved. This is a personal portfolio project; the code is shared for reference but not licensed for reuse.
