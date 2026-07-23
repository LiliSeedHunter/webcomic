// ======================
// SUPABASE
// ======================
const SUPABASE_URL = "https://vihlqgfgrrzyocbtxjmw.supabase.co";
const SUPABASE_KEY = "sb_publishable_IQ9vEc6XoFoXeqzAU11qfg_9Qx9rdBk";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ======================
// GLOBALS
// ======================
let storyScenes = [];
let allowImageLoading = true;
let jumpAmount = 1;
const jumpValues = [1, 10, 50];
let jumpIndex = 0;

// ======================
// SEED COUNTER
// ======================
async function loadSeedTotal() {
    const counter = document.getElementById("seed-total");
    if (!counter) return;

    const { data, error } = await supabaseClient
        .from("seed_counter")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Seed load error:", error);
        return;
    }

    const current = data.total ?? 0;
    counter.textContent = `${current} 🌱 GLOBAL SEED RESERVE`;
}

async function contributeSeed(button) {
    if (button) {
        button.disabled = true;
        button.classList.add("registered");
    }

    const { error } = await supabaseClient.rpc("increment_seed");

    if (error) {
        console.error("Seed increment error:", error);
        if (button) {
            button.disabled = false;
            button.classList.remove("registered");
        }
        return;
    }

    await loadSeedTotal();

    if (button) {
        setTimeout(() => {
            button.disabled = false;
            button.classList.remove("registered");
        }, 1500);
    }
}

// ======================
// IMAGE HELPERS
// ======================
function loadSceneImage(scene) {
    const img = scene.querySelector("img[data-src]");
    if (img) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    }
}

function jumpToScene(index) {
    if (!storyScenes[index]) return;

    loadSceneImage(storyScenes[index]);

    // preload next few
    for (let i = index + 1; i <= index + 3; i++) {
        if (storyScenes[i]) loadSceneImage(storyScenes[i]);
    }

    storyScenes[index].scrollIntoView({
        behavior: "instant",
        block: "start"
    });
}

// ======================
// FADE-IN OBSERVER
// ======================
function setupFadeObserver() {
    const sceneObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll(".scene").forEach((scene) => {
        sceneObserver.observe(scene);
    });
}

// ======================
// LAZY IMAGE OBSERVER
// ======================
function setupImageObserver() {
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && allowImageLoading) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src");
                    }
                    imageObserver.unobserve(img);
                }
            });
        },
        { rootMargin: "600px 0px" }
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
    });
}

// ======================
// FLOATING NAVIGATION
// ======================
function setupNavigation() {
    const scenes = document.querySelectorAll(".scene");
    const topButton = document.getElementById("topButton");
    const nextButton = document.getElementById("nextButton");
    const jumpButton = document.getElementById("jumpButton");

    // Jump multiplier
    if (jumpButton) {
        jumpButton.onclick = () => {
            jumpIndex++;
            if (jumpIndex >= jumpValues.length) jumpIndex = 0;
            jumpAmount = jumpValues[jumpIndex];
            jumpButton.textContent = jumpAmount + "X";
        };
    }

    // Go to top
    if (topButton) {
        topButton.onclick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }

    // Next scene
    if (nextButton) {
        nextButton.onclick = () => {
            let current = 0;

            scenes.forEach((scene, index) => {
                const rect = scene.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2) {
                    current = index;
                }
            });

            let target = current + jumpAmount;
            if (target >= scenes.length) target = scenes.length - 1;

            if (jumpAmount > 1) allowImageLoading = false;

            scenes[target].scrollIntoView({
                behavior: jumpAmount === 1 ? "smooth" : "instant",
                block: "start"
            });

            loadSceneImage(scenes[target]);

            if (jumpAmount > 1) {
                setTimeout(() => {
                    allowImageLoading = true;
                }, 500);
            }
        };
    }
}

// ======================
// AGE VERIFICATION
// ======================
function setupAgeGate() {
    const ageGate = document.getElementById("age-gate");
    const enterButton = document.getElementById("enterButton");
    const leaveButton = document.getElementById("leaveButton");

    if (!ageGate) return;

    document.body.style.overflow = "hidden";

    if (localStorage.getItem("ageAccepted") === "true") {
        ageGate.style.display = "none";
        document.body.style.overflow = "auto";
    }

    if (enterButton) {
        enterButton.onclick = () => {
            localStorage.setItem("ageAccepted", "true");
            ageGate.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    if (leaveButton) {
        leaveButton.onclick = () => {
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
// LOAD QUESTS
// ======================
async function loadQuests() {
    try {
        const res = await fetch("quests.json");
        const quests = await res.json();

        const container = document.getElementById("quest-list");
        if (!container) return;

        container.innerHTML = "";

        quests.forEach((quest) => {
            const card = document.createElement("div");
            card.className = "quest-card";
            card.onclick = () => {
                // start is 1-based in the JSON
                const index = quest.start - 1;
                jumpToScene(index);
            };

            card.innerHTML = `
                <img src="images/${quest.cover}" alt="${quest.title}">
                <div class="quest-info">
                    <h3>${quest.title}</h3>
                    <div class="quest-range">SCENES ${quest.start} – ${quest.end}</div>
                    <p class="quest-description">${quest.description}</p>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Quests load error:", err);
    }
}

// ======================
// LOAD STORY
// ======================
async function loadStory() {
    try {
        const res = await fetch("story.json");
        const story = await res.json();

        const container = document.getElementById("story");
        if (!container) return;

        container.innerHTML = "";

        story.forEach((item, index) => {
            const scene = document.createElement("div");
            scene.className = "scene";
            scene.id = `scene-${index + 1}`;

            const num = String(index + 1).padStart(3, "0");

            scene.innerHTML = `
                <div class="progress">SCENE ${num} / ${String(story.length).padStart(3, "0")}</div>
                <p class="caption">${item.text}</p>
                <img data-src="images/${item.image}" alt="Scene ${num}">
            `;

            container.appendChild(scene);
        });

        // aggiorna la lista globale
        storyScenes = Array.from(document.querySelectorAll(".scene"));
    } catch (err) {
        console.error("Story load error:", err);
    }
}

// ======================
// LOAD CONTENT (main)
// ======================
async function loadContent() {
    try {
        await Promise.all([loadQuests(), loadStory()]);

        // ora che il DOM è popolato possiamo attaccare gli observer e la navigazione
        setupFadeObserver();
        setupImageObserver();
        setupNavigation();

        // carica il contatore seed
        loadSeedTotal();
    } catch (error) {
        console.error("Loading error:", error);
    }
}

// ======================
// START
// ======================
setupAgeGate();
loadContent();
