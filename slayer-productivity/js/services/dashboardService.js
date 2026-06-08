const DashboardService = {

    stats() {

        const projects =
            ProjectService.getAll();

        const tasks =
            TaskService.getAll();

        return {

            projects:
                projects.length,

            tasks:
                tasks.length

        };

    }

};
