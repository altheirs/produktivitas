const pageContainer =
    document.getElementById(
        "dashboard-page"
    );

const routes = {

    dashboard: renderDashboard,
    tasks: renderTasks,
    projects: renderProjects,
    notes: renderNotes,
    kanban: renderKanban,
    habits: renderHabits,
    goals: renderGoals,
    focus: renderFocus,
    finance: renderFinance,
    calendar: renderCalendar

};

function navigate(page) {

    if (!routes[page]) return;

    pageContainer.innerHTML =
        routes[page]();

    if (
        page === "projects"
    ) {

        initProjectsPage();

    }
    if(page === "tasks"){

    initTasksPage();
    }
    if(page === "notes"){

    initNotesPage();

    }

    document
        .querySelectorAll(".nav")
        .forEach(nav => {

            nav.classList.remove(
                "active"
            );

            if (
                nav.dataset.page === page
            ) {

                nav.classList.add(
                    "active"
                );

            }

        });

}
