const TaskService = {

    getAll() {

        return Storage.load(
            "tasks"
        ) || [];

    },

    save(tasks) {

        Storage.save(
            "tasks",
            tasks
        );

    },

    add(task) {

        const tasks =
            this.getAll();

        tasks.push(task);

        this.save(tasks);

    },

    update(id, data) {

        const tasks =
            this.getAll().map(task => {

                if(task.id === id){

                    return {
                        ...task,
                        ...data
                    };

                }

                return task;

            });

        this.save(tasks);

    },

    delete(id) {

        const tasks =
            this.getAll().filter(
                task =>
                    task.id !== id
            );

        this.save(tasks);

    }

};