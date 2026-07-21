fetch("story.json")
    .then(response => response.json())
    .then(story => {

        const container = document.getElementById("story");

        story.forEach(scene => {

            const block = document.createElement("section");

            block.className = "scene";

            block.innerHTML = `
                <p class="caption">
                    ${scene.text}
                </p>

                <img src="images/${scene.image}">
            `;

            container.appendChild(block);

        });

    });
