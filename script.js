fetch("story.json")

.then(response => response.json())

.then(story => {


    const container =
        document.getElementById("story");


    const total = story.length;



    // CREA LE SCENE

    story.forEach((scene, index) => {


        const block =
            document.createElement("section");


        block.className = "scene";


        block.innerHTML = `

            <div class="progress">
                LOG ${String(index + 1).padStart(3, "0")}
                /
                ${String(total).padStart(3, "0")}
            </div>


            <p class="caption">
                ${scene.text}
            </p>


            <img
                data-src="images/${scene.image}"
                alt=""
            >

        `;


        container.appendChild(block);


    });





    // ======================
    // FADE IN SCENE
    // ======================


    const sceneObserver =
        new IntersectionObserver(

            entries => {


                entries.forEach(entry => {


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
        .forEach(scene => {

            sceneObserver.observe(scene);

        });







    // ======================
    // LAZY LOAD IMMAGINI
    // ======================


    const imageObserver =
        new IntersectionObserver(

            entries => {


                entries.forEach(entry => {


                    if(entry.isIntersecting){


                        const img =
                            entry.target;


                        img.src =
                            img.dataset.src;


                        img.removeAttribute(
                            "data-src"
                        );


                        imageObserver.unobserve(img);


                    }


                });


            },

            {
                rootMargin:"800px 0px"
            }

        );



    document
        .querySelectorAll("img[data-src]")
        .forEach(img => {

            imageObserver.observe(img);

        });








    // ======================
    // FLOATING NAVIGATION
    // ======================


    const scenes =
        document.querySelectorAll(".scene");


    const topButton =
        document.getElementById("topButton");


    const nextButton =
        document.getElementById("nextButton");


    const jumpButton =
        document.getElementById("jumpButton");



    let jumpAmount = 1;


    const jumpValues = [
        1,
        10,
        50
    ];


    let jumpIndex = 0;





    // CAMBIO MOLTIPLICATORE

    if(jumpButton){


        jumpButton.onclick = () => {


            jumpIndex++;


            if(jumpIndex >= jumpValues.length){

                jumpIndex = 0;

            }


            jumpAmount =
                jumpValues[jumpIndex];


            jumpButton.textContent =
                jumpAmount + "X";


        };


    }






    // TORNA ALL'INIZIO

    if(topButton){


        topButton.onclick = () => {


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });


        };


    }






    // SALTO AVANTI

    if(nextButton){


        nextButton.onclick = () => {


            let current = 0;



            scenes.forEach((scene,index)=>{


                const rect =
                    scene.getBoundingClientRect();



                if(
                    rect.top <
                    window.innerHeight / 2
                ){

                    current = index;

                }


            });



            let targetIndex =
                current + jumpAmount;



            if(targetIndex >= scenes.length){

                targetIndex =
                    scenes.length - 1;

            }



            scenes[targetIndex]
                .scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });


        };


    }

// ======================
// AGE VERIFICATION
// ======================


const ageGate =
    document.getElementById("age-gate");


const enterButton =
    document.getElementById("enterButton");


const leaveButton =
    document.getElementById("leaveButton");



if(ageGate){


    if(
        localStorage.getItem("ageAccepted")
        ===
        "true"
    ){

        ageGate.style.display =
            "none";

    }



    if(enterButton){


        enterButton.onclick = () => {


            localStorage.setItem(
                "ageAccepted",
                "true"
            );


            ageGate.style.display =
                "none";


        };


    }




    if(leaveButton){


        leaveButton.onclick = () => {


            window.location.href =
                "https://www.google.com";


        };


    }


}

});
