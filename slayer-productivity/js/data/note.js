if(
    !Storage.load("notes")
){

    Storage.save(
        "notes",
        [

            {
                id: 1,
                title:
                    "Welcome Note",

                content:
                    "This is your second brain."

            }

        ]
    );

}