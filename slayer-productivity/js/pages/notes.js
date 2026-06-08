function renderNotes() {

    const notes =
        NoteService.getAll();

    return `

    <div class="notes-page">

        <div class="notes-header">

            <h1>Knowledge Base</h1>

            <button
                id="add-note-btn"
                class="btn-primary">

                + New Note

            </button>

        </div>

        <div class="notes-grid">

            ${notes.map(note => `

                <div class="note-card">

                    <h3>
                        ${note.title}
                    </h3>

                    <p>
                        ${note.content}
                    </p>

                    <button
                        class="edit-note"
                        data-id="${note.id}">

                        Edit

                    </button>

                    <button
                        class="delete-note"
                        data-id="${note.id}">

                        Delete

                    </button>

                </div>

            `).join("")}

        </div>

    </div>

    `;

}
function initNotesPage() {

    const addBtn =
        document.getElementById(
            "add-note-btn"
        );

    if(addBtn){

        addBtn.onclick =
            openNoteModal;

    }

    document
        .querySelectorAll(
            ".delete-note"
        )
        .forEach(btn => {

            btn.onclick = () => {

                NoteService.delete(
                    Number(
                        btn.dataset.id
                    )
                );

                navigate(
                    "notes"
                );

            };

        });

    document
        .querySelectorAll(
            ".edit-note"
        )
        .forEach(btn => {

            btn.onclick = () => {

                editNote(
                    Number(
                        btn.dataset.id
                    )
                );

            };

        });

}