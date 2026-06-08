function renderDashboard() {

    const projects =
        ProjectService.getAll();

    const tasks =
        TaskService.getAll();

    const notes =
        NoteService.getAll();

    return `

    <div class="dashboard-page">

        <div class="hero">

            <h1>
                Welcome Back, Slayer
            </h1>

            <p>
                Personal Operating System
            </p>

        </div>

        <div class="stats-grid">

            <div class="card">

                <h3>Projects</h3>

                <p>
                    ${projects.length}
                </p>

            </div>

            <div class="card">

                <h3>Tasks</h3>

                <p>
                    ${tasks.length}
                </p>

            </div>

            <div class="card">

                <h3>Notes</h3>

                <p>
                    ${notes.length}
                </p>

            </div>

            <div class="card">

                <h3>Focus Score</h3>

                <p>
                    82%
                </p>

            </div>

        </div>

        <div class="dashboard-section">

            <div class="card">

                <h2>
                    Recent Tasks
                </h2>

                <ul>

                    ${
                        tasks
                        .slice(-5)
                        .reverse()
                        .map(task => `
                            <li>
                                ${task.title}
                            </li>
                        `)
                        .join("")
                    }

                </ul>

            </div>

            <div class="card">

                <h2>
                    Active Projects
                </h2>

                <ul>

                    ${
                        projects
                        .slice(-5)
                        .reverse()
                        .map(project => `
                            <li>
                                ${project.name}
                            </li>
                        `)
                        .join("")
                    }

                </ul>

            </div>

        </div>

        <div class="card">

            <h2>
                Knowledge Base
            </h2>

            <ul>

                ${
                    notes
                    .slice(-5)
                    .reverse()
                    .map(note => `
                        <li>
                            ${note.title}
                        </li>
                    `)
                    .join("")
                }

            </ul>

        </div>

    </div>

    `;

}