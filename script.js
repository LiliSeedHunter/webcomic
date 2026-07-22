// ======================
// SUPABASE
// ======================

const SUPABASE_URL =
    "https://vihlqgfgrrzyocbtxjmw.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_IQ9vEc6XoFoXeqzAU11qfg_9Qx9rdBk";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



// ======================
// SEED COUNTER
// ======================

async function loadSeedTotal(){


    const counter =
        document.getElementById(
            "seed-total"
        );


    if(!counter){
        return;
    }



    const { data, error } =
        await supabaseClient
            .from("seed_counter")
            .select("total")
            .eq("id",1)
            .single();



    if(error){

        console.error(
            "Seed load error:",
            error
        );

        return;

    }



    counter.textContent =
        data.total;


}




async function contributeSeed(){


    const { error } =
        await supabaseClient
            .rpc(
                "increment_seed"
            );



    if(error){

        console.error(
            "Seed increment error:",
            error
        );

        return;

    }



    loadSeedTotal();


}






// ======================
// LOAD STORY + QUESTS
// ======================

Promise.all([

    fetch("story.json").then(r => r.json()),

    fetch("quests.json").then(r => r.json())

])

.then(([story, quests]) => {



    const container =
        document.getElementById(
            "story"
        );



    const questContainer =
        document.getElementById(
            "quest-list"
        );



    const total =
        story.length;



    // ======================
    // LOAD GLOBAL SEED TOTAL
    // ======================

    loadSeedTotal();







    // ======================
    // CREA LE QUEST
    // ======================


    if(questContainer){



        quests.forEach(quest => {



            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "quest-card";



            card.innerHTML = `


                <img

                    src="images/${quest.cover}"

                    alt="${quest.title}"

                >



                <div class="quest-info">


                    <h3>

                        ${quest.title}

                    </h3>



                    <div class="quest-range">


                        LOG ${String(quest.start).padStart(3,"0")}

                        —

                        LOG ${String(quest.end).padStart(3,"0")}


                    </div>




                    <div class="quest-description">


                        ${quest.description}


                    </div>


                </div>


            `;




            card.onclick = () => {



                const target =
                    document.getElementById(
                        `log-${quest.start}`
                    );



                if(target){


                    target.scrollIntoView({

                        behavior:"smooth",

                        block:"start"

                    });


                }


            };



            questContainer.appendChild(
                card
            );



        });


    }









    // ======================
    // CREA LE SCENE
    // ======================


    if(container){



        story.forEach((scene,index)=>{



            const block =
                document.createElement(
                    "section"
                );



            block.className =
                "scene";



            block.id =
                `log-${index+1}`;





            block.innerHTML = `



                <div class="progress">


                    LOG ${String(index+1).padStart(3,"0")}

                    /

                    ${String(total).padStart(3,"0")}


                </div>




                <p class="caption">


                    ${scene.text}


                </p>





                <img


                    data-src="images/${scene.image}"


                    alt=""


                >





                <button class="seed-button">


                    🌱 SEED CONTRIBUTION +1


                </button>



            `;






            container.appendChild(
                block
            );





            // ======================
            // SEED BUTTON
            // ======================


            const seedButton =
                block.querySelector(
                    ".seed-button"
                );



            if(seedButton){



                seedButton.onclick = ()=>{



                    seedButton.disabled =
                        true;



                    contributeSeed();




                    setTimeout(()=>{


                        seedButton.disabled =
                            false;


                    },1000);



                };


            }



        });


    }
    // ======================
// LOAD STORY + QUESTS
// ======================

Promise.all([

    fetch("story.json").then(r => r.json()),

    fetch("quests.json").then(r => r.json())

])

.then(([story, quests]) => {


    const container =
        document.getElementById("story");


    const questContainer =
        document.getElementById("quest-list");


    const total =
        story.length;



    // ======================
    // CREA LE QUEST
    // ======================

    if(questContainer){


        quests.forEach(quest => {


            const card =
                document.createElement("div");


            card.className =
                "quest-card";



            card.innerHTML = `

                <img
                    src="images/${quest.cover}"
                    alt="${quest.title}"
                >

                <div class="quest-info">


                    <h3>
                        ${quest.title}
                    </h3>


                    <div class="quest-range">

                        LOG ${String(quest.start).padStart(3,"0")}
                        —
                        LOG ${String(quest.end).padStart(3,"0")}

                    </div>


                    <div class="quest-description">

                        ${quest.description}

                    </div>


                </div>

            `;



            card.onclick = () => {


                const target =
                    document.getElementById(
                        `log-${quest.start}`
                    );


                if(target){


                    target.scrollIntoView({

                        behavior:"smooth",

                        block:"start"

                    });


                }


            };



            questContainer.appendChild(card);


        });


    }







    // ======================
    // CREA LE SCENE
    // ======================


    if(container){


        story.forEach((scene,index)=>{


            const block =
                document.createElement("section");


            block.className =
                "scene";


            block.id =
                `log-${index+1}`;



            block.innerHTML = `


                <div class="progress">

                    LOG ${String(index+1).padStart(3,"0")}
                    /
                    ${String(total).padStart(3,"0")}

                </div>



                <p class="caption">

                    ${scene.text}

                </p>



                <img

                    data-src="images/${scene.image}"

                    alt=""

                >



                <button
                    class="seed-button"
                    onclick="contributeSeed()"
                >

                    🌱 SEED CONTRIBUTION +1

                </button>


            `;



            container.appendChild(block);


        });


    }






    // ======================
    // CARICA TOTALE SEED
    // ======================

    loadSeedTotal();
