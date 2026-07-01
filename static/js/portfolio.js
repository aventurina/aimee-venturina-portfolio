document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // STATE
    // =========================
    let projects = [];
    let activeFilter = "*";

    // Cache DOM elements
    const grid = document.getElementById("portfolioGrid");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const modalEl = document.getElementById("projectModal");
    const contactForm = document.getElementById("contactForm");
    const contactFormMessage = document.getElementById("contactFormMessage");

    // Cache modal fields (avoids repeated DOM queries)
    const modal = {
        title: document.getElementById("modalTitle"),
        description: document.getElementById("modalDescription"),
        tech: document.getElementById("modalTech"),
        image: document.getElementById("modalImage"),
        github: document.getElementById("modalGithub"),
        live: document.getElementById("modalLive"),
    };

    // =========================
    // INIT
    // =========================
    init();

    function init() {
        loadProjects();
        bindFilters();
        bindPortfolioClicks();
        bindContactForm();
    }

    // =========================
    // DATA
    // =========================
    async function loadProjects() {
        try {
            const res = await fetch("/static/js/projects.json");

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const githubBase = `https://github.com/${data.githubUser}`;

            projects = data.projects.map((project) => ({
                ...project,
                github: `${githubBase}/${project.repo}`,
                thumbnail: `${data.imageBase}/${project.thumbnail}`,
                image: `${data.imageBase}/${project.image}`,
            }));
            render();
        } catch (err) {
            console.error("Failed to load projects:", err);
            grid.innerHTML = `<p class="text-danger">Failed to load projects.</p>`;
        }
    }

    // =========================
    // RENDER
    // =========================
    function render() {
        const visible = filterProjects(projects);

        grid.innerHTML = visible
            .map((project, index) => createCard(project, index))
            .join("");
    }

    function createCard(project, index) {
        const techList = Array.isArray(project.tech)
            ? project.tech.join(", ")
            : (project.tech || "");

        return `
		<div class="portfolio-card">
			<div class="portfolio-item" style="animation-delay:${index * 0.08}s">

				<div class="hover-bg">
					<a href="#"
					   class="portfolio-link"
					   data-title="${project.title}"
					   data-description="${project.description}"
					   data-tech="${techList}"
					   data-image="${project.image}"
					   data-github="${project.github}"
					   data-live="${project.demo || ''}">

						<div class="hover-text">
							<h4>${project.title}</h4>
						</div>

						<img src="${project.thumbnail}" alt="${project.title}" loading="lazy">

					</a>
				</div>

			</div>
		</div>
	`;
    }

    // =========================
    // FILTERING
    // =========================
    function filterProjects(list) {
        if (activeFilter === "*") return list;

        const category = activeFilter.replace(".", "");
        return list.filter((p) => p.category === category);
    }

    function bindFilters() {
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();

                activeFilter = btn.dataset.filter;

                setActiveFilter(btn);
                render();
            });
        });
    }

    function setActiveFilter(activeBtn) {
        filterButtons.forEach((b) => b.classList.remove("active"));
        activeBtn.classList.add("active");
    }

    // =========================
    // MODAL (EVENT DELEGATION)
    // =========================
    function bindPortfolioClicks() {
        document.addEventListener("click", (e) => {
            const link = e.target.closest(".portfolio-link");
            if (!link) return;

            e.preventDefault();
            openModal(link.dataset);
        });
    }

    function openModal(data) {
        modal.title.textContent = data.title;
        modal.description.textContent = data.description;
        modal.tech.innerHTML = data.tech ? `<strong>Tech Stack:</strong> ${data.tech}` : '';
        modal.image.src = data.image;

        modal.github.href = data.github;
        modal.live.href = data.live || "#";

        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }

    // =========================
    // CONTACT FORM
    // =========================
    function bindContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const res = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                contactForm.reset();
                showContactMessage("Thank you! Your message has been sent.", "success");
            } catch (err) {
                console.error("Failed to submit form:", err);
                showContactMessage("Sorry, something went wrong. Please try again.", "danger");
            }
        });
    }

    function showContactMessage(text, type) {
        if (!contactFormMessage) return;

        contactFormMessage.textContent = text;
        contactFormMessage.className = `mt-3 alert alert-${type}`;
    }

    // =========================
    // SECURITY HELPERS
    // =========================
    function escapeHtml(str = "") {
        return str
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
});