function openProjectModal() {

    const name =
        prompt("Project Name");

    if (!name) return;

    ProjectService.add({

        id: Date.now(),

        name: name,

        description:
            "New Project",

        progress: 0

    });

    navigate("projects");

}

function editProject(id) {

    const projects =
        ProjectService.getAll();

    const project =
        projects.find(
            p => p.id === id
        );

    if (!project) return;

    const name =
        prompt(
            "Edit Project Name",
            project.name
        );

    if (!name) return;

    ProjectService.update(
        id,
        {
            name: name
        }
    );

    navigate("projects");

}
function openTaskModal() {

    const title =
        prompt(
            "Task Title"
        );

    if(!title) return;

    TaskService.add({

        id: Date.now(),

        title,

        status: "todo",

        priority: "medium",

        createdAt:
            Date.now()

    });

    navigate("tasks");

}
function editTask(id) {

    const tasks =
        TaskService.getAll();

    const task =
        tasks.find(
            t => t.id === id
        );

    if(!task) return;

    const title =
        prompt(
            "Edit Task",
            task.title
        );

    if(!title) return;

    TaskService.update(
        id,
        {
            title
        }
    );

    navigate(
        "tasks"
    );

}
function openNoteModal() {

    const title =
        prompt(
            "Note Title"
        );

    if(!title) return;

    NoteService.add({

        id: Date.now(),

        title,

        content:
            "New Note"

    });

    navigate(
        "notes"
    );

}
function editNote(id) {

    const notes =
        NoteService.getAll();

    const note =
        notes.find(
            n => n.id === id
        );

    if(!note) return;

    const title =
        prompt(
            "Edit Note",
            note.title
        );

    if(!title) return;

    NoteService.update(
        id,
        {
            title
        }
    );

    navigate(
        "notes"
    );

}