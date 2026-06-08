if(
    !Storage.load("tasks")
){

    Storage.save(
        "tasks",
        [

            {
                id:1,
                title:
                "Finish Dashboard",
                priority:"high"
            },

            {
                id:2,
                title:
                "Study FastAPI",
                priority:"medium"
            }

        ]
    );

}
