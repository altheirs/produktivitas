const NoteService = {

    getAll() {

        return Storage.load(
            "notes"
        ) || [];

    },

    save(notes) {

        Storage.save(
            "notes",
            notes
        );

    },

    add(note) {

        const notes =
            this.getAll();

        notes.push(note);

        this.save(notes);

    },

    update(id, data) {

        const notes =
            this.getAll().map(note => {

                if(note.id === id){

                    return {
                        ...note,
                        ...data
                    };

                }

                return note;

            });

        this.save(notes);

    },

    delete(id) {

        const notes =
            this.getAll().filter(
                note =>
                    note.id !== id
            );

        this.save(notes);

    }

};