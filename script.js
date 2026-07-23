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
function loadImage(index) {
    const scene = storyScenes[index];
    if (!scene) return;

    const img = scene.querySelector("img");
    if (img && img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    }
}

function preloadNextImages(index, amount = 3) {
    for (let i = index + 1; i <= index + amount; i++) {
        const scene = storyScenes[i];
        if (!scene) continue;

        const img = scene.querySelector("img");
        if (img && img.dataset.src) {
            const preload = new Image();
            preload.src = img.dataset.src;
        }
    }
}

function loadSceneImage(scene) {
    const img = scene.querySelector("img[data-src]");
    if (img) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    }
}

function jumpToScene(index) {
    if (!storyScenes[index]) return;

    loadImage(index);
    preloadNextImages(index, 3);

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
            if (jumpIndex >= jumpValues.length) {
                jumpIndex = 0;
            }
            jumpAmount = jumpValues[jumpIndex];
            jumpButton.textContent = jumpAmount + "X";
        };
    }

    // Go to top
    if (topButton) {
        topButton.onclick = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
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
            if (target >= scenes.length) {
                target = scenes.length - 1;
            }

            // Block normal lazy-load during big jumps
            if (jumpAmount > 1) {
                allowImageLoading = false;
            }

            scenes[target].scrollIntoView({
                behavior: jumpAmount === 1 ? "smooth" : "instant",
                block: "start"
            });

            // Load only the destination image
            loadSceneImage(scenes[target]);

            // Re-enable normal loading after jump
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
// LOAD CONTENT
// ======================
function loadContent() {
    try {
        // Populate storyScenes for the image helpers
        storyScenes = Array.from(document.querySelectorAll(".scene"));

        setupFadeObserver();
        setupImageObserver();
        setupNavigation();

        // Load the seed counter
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
