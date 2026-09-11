const STORAGE_KEY = "dangels_print_studio_projects";


function getProjects() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Error leyendo proyectos:",
                error
            );

        }
    }

    return window.DANGELS_PROJECTS
        ? [...window.DANGELS_PROJECTS]
        : [];
}


function saveProjects(projects) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );
}


function renderProjects() {

    const container =
        document.getElementById(
            "projectsContainer"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    const counter =
        document.getElementById(
            "projectCount"
        );

    const projects =
        getProjects();


    counter.textContent =
        projects.length;


    if (!projects.length) {

        container.innerHTML = "";

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    container.innerHTML =
        projects.map(project => {

            const paidClass =
                project.paid
                    ? "paid"
                    : "";

            const statusText =
                project.paid
                    ? "PAGADO"
                    : "PENDIENTE DE PAGO";


            return `
                <article class="project-card">

                    <div class="project-preview">

                        <div class="project-preview-mark">
                            DP
                        </div>

                    </div>


                    <div class="project-content">

                        <h3 class="project-name">
                            ${escapeHtml(project.name)}
                        </h3>

                        <div class="project-slug">
                            /${escapeHtml(project.slug)}
                        </div>


                        <div class="project-status ${paidClass}">

                            <span>●</span>

                            ${statusText}

                        </div>


                        <div class="project-actions">

                            <a
                                href="./projects/${encodeURIComponent(project.slug)}/"
                                target="_blank"
                            >
                                Ver protegida
                            </a>


                            <button
                                onclick="copyProtectedLink('${escapeAttribute(project.slug)}')"
                            >
                                Copiar link
                            </button>


                            ${
                                project.paid
                                    ? `
                                        <button
                                            onclick="copyCanvaLink('${escapeAttribute(project.canvaUrl)}')"
                                        >
                                            Copiar Canva
                                        </button>

                                        <a
                                            href="${escapeAttribute(project.canvaUrl)}"
                                            target="_blank"
                                        >
                                            Abrir original
                                        </a>
                                    `
                                    : `
                                        <button
                                            onclick="markAsPaid('${escapeAttribute(project.id)}')"
                                        >
                                            Marcar pagado
                                        </button>

                                        <button
                                            class="danger"
                                            onclick="deleteProject('${escapeAttribute(project.id)}')"
                                        >
                                            Eliminar
                                        </button>
                                    `
                            }

                        </div>

                    </div>

                </article>
            `;

        }).join("");
}


function openNewProjectModal() {

    document.getElementById(
        "projectModal"
    ).style.display = "flex";

    document.getElementById(
        "projectName"
    ).focus();
}


function closeNewProjectModal() {

    document.getElementById(
        "projectModal"
    ).style.display = "none";

    document.getElementById(
        "projectForm"
    ).reset();
}


document
    .getElementById("projectForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("projectName")
                    .value
                    .trim();


            const slug =
                document
                    .getElementById("projectSlug")
                    .value
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");


            const canvaUrl =
                document
                    .getElementById("canvaUrl")
                    .value
                    .trim();


            if (!name || !slug || !canvaUrl) {

                alert(
                    "Completa todos los campos."
                );

                return;
            }


            const projects =
                getProjects();


            const duplicate =
                projects.some(
                    project =>
                        project.slug === slug
                );


            if (duplicate) {

                alert(
                    "Ya existe un proyecto con ese slug."
                );

                return;
            }


            const project = {

                id:
                    crypto.randomUUID(),

                name,

                slug,

                canvaUrl,

                paid: false,

                createdAt:
                    new Date()
                        .toISOString()
            };


            projects.push(project);


            saveProjects(projects);


            closeNewProjectModal();


            renderProjects();


            alert(
                "Proyecto creado correctamente."
            );

        }
    );


function markAsPaid(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) {
        return;
    }


    const confirmed =
        confirm(
            `¿Marcar "${project.name}" como PAGADO?`
        );


    if (!confirmed) {
        return;
    }


    project.paid = true;


    saveProjects(projects);


    renderProjects();
}


function deleteProject(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) {
        return;
    }


    const confirmed =
        confirm(
            `¿Eliminar "${project.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const updated =
        projects.filter(
            item => item.id !== id
        );


    saveProjects(updated);


    renderProjects();
}


function copyProtectedLink(slug) {

    const url =
        `${window.location.origin}/projects/${slug}/`;


    copyText(
        url,
        "Link protegido copiado."
    );
}


function copyCanvaLink(url) {

    copyText(
        url,
        "Link original de Canva copiado."
    );
}


async function copyText(text, message) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        alert(message);

    } catch (error) {

        prompt(
            "Copia este enlace:",
            text
        );
    }
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}


renderProjects();