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



    // FADE IN DELLE SCENE

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
                threshold: 0.1
            }

        );



    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            sceneObserver.observe(scene);

        });



    // LAZY LOADING IMMAGINI ANTICIPATO

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
                rootMargin: "800px 0px"
            }

        );



    document
        .querySelectorAll("img[data-src]")
        .forEach(img => {

            imageObserver.observe(img);

        });





    // ==========================
    // FLOATING NAVIGATION BUTTONS
    // ==========================


    const scenes =
        document.querySelectorAll(".scene");


    const topButton =
        document.getElementById("topButton");


    const nextButton =
        document.getElementById("nextButton");



    // TORNA ALL'INIZIO

    if(topButton){

        topButton.onclick = () => {


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


        };

    }




    // PASSA ALLA SCENA SUCCESSIVA

    if(nextButton){


        nextButton.onclick = () => {


            let current = 0;



            scenes.forEach((scene, index) => {


                const rect =
                    scene.getBoundingClientRect();



                if(
                    rect.top <
                    window.innerHeight / 2
                ){

                    current = index;

                }


            });



            const next =
                scenes[current + 1];



            if(next){


                next.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


            }


        };


    }



});
