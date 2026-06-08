function renderProjects() {

    const projects =
        ProjectService.getAll();

    return `

    <div class="projects-page">

        <div class="projects-header">

            <h1>Projects</h1>

            <button
                id="add-project-btn"
                class="btn-primary">

                + New Project

            </button>

        </div>

        <div class="project-grid">

            ${projects.map(project => `

                <div class="project-card">

                    <h3>
                        ${project.name}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                    <div>

                        <button
                            class="edit-project"
                            data-id="${project.id}">

                            Edit

                        </button>

                        <button
                            class="delete-project"
                            data-id="${project.id}">

                            Delete

                        </button>

                    </div>

                </div>

            `).join("")}

        </div>

    </div>

    `;

}

function initProjectsPage() {

    const addBtn =
        document.getElementById(
            "add-project-btn"
        );

    if (addBtn) {

        addBtn.onclick =
            openProjectModal;

    }

    document
        .querySelectorAll(
            ".delete-project"
        )
        .forEach(btn => {

            btn.onclick = () => {

                const id =
                    Number(
                        btn.dataset.id
                    );

                ProjectService.delete(
                    id
                );

                navigate(
                    "projects"
                );

            };

        });

    document
        .querySelectorAll(
            ".edit-project"
        )
        .forEach(btn => {

            btn.onclick = () => {

                const id =
                    Number(
                        btn.dataset.id
                    );

                editProject(id);

            };

        });

}