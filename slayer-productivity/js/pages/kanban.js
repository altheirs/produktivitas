function renderKanban() {

    const tasks =
        TaskService.getAll();

    const todo =
        tasks.filter(
            t => t.status === "todo"
        );

    const doing =
        tasks.filter(
            t => t.status === "doing"
        );

    const done =
        tasks.filter(
            t => t.status === "done"
        );

    return `

    <div class="kanban-page">

        <h1>
            Kanban Board
        </h1>

        <div class="kanban-board">

            <div class="kanban-column">

                <h3>Todo</h3>

                ${todo.map(task => `

                    <div class="task-card">

                        ${task.title}

                    </div>

                `).join("")}

            </div>

            <div class="kanban-column">

                <h3>Doing</h3>

                ${doing.map(task => `

                    <div class="task-card">

                        ${task.title}

                    </div>

                `).join("")}

            </div>

            <div class="kanban-column">

                <h3>Done</h3>

                ${done.map(task => `

                    <div class="task-card">

                        ${task.title}

                    </div>

                `).join("")}

            </div>

        </div>

    </div>

    `;

}