function renderTasks() {

    const tasks =
        TaskService.getAll();

    return `

    <div class="tasks-page">

        <div class="tasks-header">

            <h1>Tasks</h1>

            <button
                id="add-task-btn"
                class="btn-primary">

                + New Task

            </button>

        </div>

        <div class="task-list">

            ${tasks.map(task => `

                <div class="task-card">

                    <h3>
                        ${task.title}
                    </h3>

                    <p>
                        ${task.priority}
                    </p>

                    <button
                        class="edit-task"
                        data-id="${task.id}">

                        Edit

                    </button>

                    <button
                        class="delete-task"
                        data-id="${task.id}">

                        Delete

                    </button>

                </div>

            `).join("")}

        </div>

    </div>

    `;

}
function initTasksPage() {

    const addBtn =
        document.getElementById(
            "add-task-btn"
        );

    if(addBtn){

        addBtn.onclick =
            openTaskModal;

    }

    document
        .querySelectorAll(
            ".delete-task"
        )
        .forEach(btn => {

            btn.onclick = () => {

                TaskService.delete(
                    Number(
                        btn.dataset.id
                    )
                );

                navigate(
                    "tasks"
                );

            };

        });

    document
        .querySelectorAll(
            ".edit-task"
        )
        .forEach(btn => {

            btn.onclick = () => {

                editTask(
                    Number(
                        btn.dataset.id
                    )
                );

            };

        });

}