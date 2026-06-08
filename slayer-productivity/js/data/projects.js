if(
    !Storage.load("projects")
){

    Storage.save(
        "projects",
        [

            {
                id:1,
                name:"SlayerOS",
                description:
                "Personal Operating System",
                progress:40
            },

            {
                id:2,
                name:
                "CyberAttack Realtime",
                description:
                "SOC Monitoring Platform",
                progress:75
            }

        ]
    );

}
