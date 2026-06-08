const ProjectService = {

    getAll() {

        return Storage.load(
            "projects"
        ) || [];

    },

    save(projects) {

        Storage.save(
            "projects",
            projects
        );

    },

    add(project) {

        const projects =
            this.getAll();

        projects.push(project);

        this.save(projects);

    },

    update(id, data) {

        const projects =
            this.getAll().map(project => {

                if (
                    project.id === id
                ) {

                    return {
                        ...project,
                        ...data
                    };

                }

                return project;

            });

        this.save(projects);

    },

    delete(id) {

        const projects =
            this.getAll().filter(
                project =>
                    project.id !== id
            );

        this.save(projects);

    }

};