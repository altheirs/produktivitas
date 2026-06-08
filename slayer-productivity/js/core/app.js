document.addEventListener(
    "DOMContentLoaded",
    () => {

        navigate("dashboard");

        document
            .querySelectorAll(".nav")
            .forEach(nav => {

                nav.addEventListener(
                    "click",
                    () => {

                        navigate(
                            nav.dataset.page
                        );

                    }
                );

            });

    }
);