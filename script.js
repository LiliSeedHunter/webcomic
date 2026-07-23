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


    const progress =
        document.getElementById(
            "seed-progress"
        );


    const bar =
        document.getElementById(
            "seed-progress-bar"
        );



    if(!counter){
        return;
    }



    const { data, error } =
        await supabaseClient
            .from("seed_counter")
            .select("*")
            .eq("id",1)
            .single();



    if(error){

        console.error(
            "Seed load error:",
            error
        );

        return;

    }



    const current =
        data.total ?? 0;



counter.textContent =
    `🌱 ${current} SEED loads deposited to Lili`;

}

async function contributeSeed(button){


    if(button){

        button.disabled = true;

        button.classList.add(
            "registered"
        );

    }



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


        if(button){

            button.disabled = false;

            button.classList.remove(
                "registered"
            );

        }


        return;


    }



    await loadSeedTotal();



    if(button){


        setTimeout(()=>{


            button.disabled = false;


            button.classList.remove(
                "registered"
            );


        },1500);


    }


}

// ======================
// LOAD STORY + QUESTS
// ======================


async function loadContent(){


    try{


        const [

            storyResponse,

            questsResponse

        ] = await Promise.all([


            fetch("story.json"),


            fetch("quests.json")


        ]);




        if(!storyResponse.ok){

            throw new Error(
                "story.json loading failed"
            );

        }




        if(!questsResponse.ok){

            throw new Error(
                "quests.json loading failed"
            );

        }




        const story =
            await storyResponse.json();



        const quests =
            await questsResponse.json();





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



        loadSeedTotal();





        // ======================
        // CREATE QUESTS
        // ======================


        if(questContainer){


            quests.forEach(quest=>{


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




card.onclick = ()=>{


    const target =
        document.getElementById(
            `log-${quest.start}`
        );


    if(target){


        target.scrollIntoView({

            behavior:"instant",

            block:"start"

        });


        const img =
            target.querySelector(
                "img[data-src]"
            );


        if(img){


            img.src =
                img.dataset.src;


            img.removeAttribute(
                "data-src"
            );


        }


    }


};




                questContainer.appendChild(
                    card
                );


            });


        }







        // ======================
        // CREATE SCENES
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


                            <span class="seed-icon">🌱</span>

                            Add Your Load +1


                    </button>



                `;





                container.appendChild(
                    block
                );





                const seedButton =
                    block.querySelector(
                        ".seed-button"
                    );



if(seedButton){


    seedButton.onclick = ()=>{


        seedButton.innerHTML =
            '<span class="seed-icon">🌱</span> Overflow Registered ✓';



        contributeSeed(seedButton);



        setTimeout(()=>{


            seedButton.innerHTML =
                '<span class="seed-icon">🌱</span> Add Your Load +1';



        },1500);



    };


}



            });



        }







        // ======================
        // FADE IN OBSERVER
        // ======================


        const sceneObserver =
            new IntersectionObserver(

                entries=>{


                    entries.forEach(entry=>{


                        if(entry.isIntersecting){


                            entry.target.classList.add(
                                "visible"
                            );


                        }


                    });



                },


                {

                    threshold:0.1

                }


            );





        document
            .querySelectorAll(".scene")
            .forEach(scene=>{


                sceneObserver.observe(scene);


            });






// ======================
// IMAGE LAZY LOAD
// ======================

let allowImageLoading = true;

        
const imageObserver =
    new IntersectionObserver(

        entries=>{


            entries.forEach(entry=>{


                    if(
                        entry.isIntersecting &&
                        allowImageLoading
                    ){


                    const img =
                        entry.target;



                    if(img.dataset.src){


                        img.src =
                            img.dataset.src;


                        img.removeAttribute(
                            "data-src"
                        );


                    }



                    imageObserver.unobserve(
                        img
                    );


                }


            });



        },


        {

            rootMargin:
                "200px 0px"

        }


    );





document
    .querySelectorAll(
        "img[data-src]"
    )
    .forEach(img=>{


        imageObserver.observe(
            img
        );


    });

        
        // ======================
        // FLOATING NAVIGATION
        // ======================


        const scenes =
            document.querySelectorAll(
                ".scene"
            );



        const topButton =
            document.getElementById(
                "topButton"
            );



        const nextButton =
            document.getElementById(
                "nextButton"
            );



        const jumpButton =
            document.getElementById(
                "jumpButton"
            );





        let jumpAmount = 1;



        const jumpValues =
            [
                1,
                10,
                50
            ];



        let jumpIndex = 0;







        // ======================
        // JUMP MULTIPLIER
        // ======================


        if(jumpButton){


            jumpButton.onclick = ()=>{


                jumpIndex++;



                if(
                    jumpIndex >=
                    jumpValues.length
                ){

                    jumpIndex = 0;

                }




                jumpAmount =
                    jumpValues[jumpIndex];




                jumpButton.textContent =
                    jumpAmount + "X";



            };


        }









        // ======================
        // GO TOP
        // ======================


        if(topButton){


            topButton.onclick = ()=>{


                window.scrollTo({


                    top:0,


                    behavior:"smooth"



                });



            };


        }









        // ======================
        // NEXT SCENE
        // ======================


        if(nextButton){


            nextButton.onclick = ()=>{



                let current = 0;





                scenes.forEach(
                    (scene,index)=>{


                        const rect =
                            scene.getBoundingClientRect();




                        if(
                            rect.top <
                            window.innerHeight / 2
                        ){


                            current = index;


                        }



                    }
                );







                let target =
                    current + jumpAmount;

                if(jumpAmount > 1){

                    allowImageLoading = false;

                }




                if(
                    target >=
                    scenes.length
                ){


                    target =
                        scenes.length - 1;


                }








scenes[target]
    .scrollIntoView({


        behavior:
            jumpAmount === 1
                ? "smooth"
                : "instant",


        block:"start"



    });



if(jumpAmount > 1){


    setTimeout(()=>{


        allowImageLoading = true;


        const img =
            scenes[target].querySelector(
                "img[data-src]"
            );


        if(img){


            img.src =
                img.dataset.src;


            img.removeAttribute(
                "data-src"
            );


        }


    },300);


}


const img =
    scenes[target].querySelector(
        "img[data-src]"
    );


if(img){


    img.src =
        img.dataset.src;


    img.removeAttribute(
        "data-src"
    );


}



            };



        }







    }


    catch(error){


        console.error(

            "Loading error:",

            error

        );


    }


}

// ======================
// AGE VERIFICATION
// ======================


function setupAgeGate(){



    const ageGate =
        document.getElementById(
            "age-gate"
        );



    const enterButton =
        document.getElementById(
            "enterButton"
        );



    const leaveButton =
        document.getElementById(
            "leaveButton"
        );





    if(!ageGate){

        return;

    }







    document.body.style.overflow =
        "hidden";








    if(
        localStorage.getItem(
            "ageAccepted"
        )
        ===
        "true"
    ){



        ageGate.style.display =
            "none";



        document.body.style.overflow =
            "auto";



    }








    if(enterButton){



        enterButton.onclick = ()=>{



            localStorage.setItem(

                "ageAccepted",

                "true"

            );





            ageGate.style.display =
                "none";





            document.body.style.overflow =
                "auto";



        };



    }










    if(leaveButton){



        leaveButton.onclick = ()=>{



            document.body.innerHTML = `



                <div style="

                    height:100vh;

                    display:flex;

                    justify-content:center;

                    align-items:center;

                    background:#000;

                    color:#aaa;

                    font-family:Georgia,serif;

                    text-align:center;

                ">



                    <h2>


                        Access denied.<br>

                        You must be 18+ to continue.



                    </h2>



                </div>



            `;



        };



    }





}











// ======================
// START
// ======================



setupAgeGate();


loadContent();
