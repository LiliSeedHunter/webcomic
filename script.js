fetch("story.json")

.then(response => response.json())

.then(story => {


    const container =
        document.getElementById("story");


    const total = story.length;


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



    // FAST FADE IN

    const observer =
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

            observer.observe(scene);

        });


});

const imageObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    const img =
                        entry.target;

                    img.src =
                        img.dataset.src;

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
