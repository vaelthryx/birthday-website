/* ============================================================
WHEN THE STARS REMEMBER
CINEMATIC DIRECTOR
============================================================ */

"use strict";

(() => {

/* =========================================================
CONFIGURATION
========================================================= */

const CONFIG = {

musicVolume: 0.38,

birthdayName: "Someone wonderfully you.",

birthdayMessage:
"May your days be touched by little moments " +
"of magic — soft laughter, unexpected joys, " +
"beautiful memories, and dreams that slowly " +
"turn into something real. And whenever the " +
"world feels too quiet, may you always find " +
"a little light among the stars.",

letter:
"Somewhere beneath the same endless sky, " +
"another year of your story begins tonight. " +
"So I made this tiny little universe to leave " +
"behind a simple wish — that the year ahead " +
"brings you more moments worth remembering, " +
"more places worth discovering, and more " +
"reasons to smile when you least expect it. " +
"May your dreams wander farther than the " +
"stars, and may life surprise you in all the " +
"right ways. " +
"Happy Birthday. ✦"

chapters: [
"CHAPTER I",
"CHAPTER II",
"CHAPTER III",
"CHAPTER IV",
"CHAPTER V",
"CHAPTER VI"
]

};


/* =========================================================
DOM
========================================================= */

const $ = (selector) =>
document.querySelector(selector);

const $$ = (selector) =>
[...document.querySelectorAll(selector)];


const DOM = {

loader: $("#loader"),
loaderBar: $("#loader-bar"),
loaderStatus: $("#loader-status"),

world: $("#world"),

background: $("#background"),
moon: $("#moon-image"),

movie: $("#movie"),

scenes: {
intro: $("#scene-intro"),
forest: $("#scene-forest"),
stars: $("#scene-stars"),
gift: $("#scene-gift"),
letter: $("#scene-letter"),
ending: $("#scene-ending")
},

begin: $("#begin-button"),
forestButton: $("#forest-button"),

starField: $("#interactive-stars"),
starCounter: $("#stars-found"),
starInstruction: $("#star-instruction"),

gift: $("#gift"),
giftHint: $("#gift-hint"),

letter: $("#letter"),
letterText: $("#letter-text"),
letterSignature: $("#letter-signature"),
letterButton: $("#letter-button"),

birthdayName: $("#birthday-name"),
birthdayMessage: $("#birthday-message"),

chapter: $("#chapter"),
progress: $("#progress-bar"),

subtitle: $("#subtitle"),

soundButton: $("#sound-button"),
soundSymbol: $("#sound-symbol"),
soundText: $("#sound-text"),

transition: $("#transition"),

music: $("#backgroundMusic"),

stars: $("#stars"),
shootingStars: $("#shooting-stars"),
fireflies: $("#fireflies"),

fireworks: $("#fireworks")

};


/* =========================================================
STATE
========================================================= */

const state = {

initialized: false,

chapter: 0,

musicStarted: false,

musicEnabled: true,

starsFound: 0,

totalStars: 5,

giftOpened: false,

letterOpened: false,

finaleStarted: false,

introStarted: false,

startTime: 0,

elapsed: 0,

lastFrame: 0,

fireworks: [],

particles: []

};


/* =========================================================
UTILITY
========================================================= */

const wait = (ms) =>
new Promise(resolve => setTimeout(resolve, ms));


const clamp = (value, min, max) =>
Math.max(min, Math.min(max, value));


const random = (min, max) =>
Math.random() * (max - min) + min;


const choose = array =>
array[Math.floor(Math.random() * array.length)];


/* =========================================================
PRELOAD
========================================================= */

function preloadImages() {

const images = [
"background.png",
"moon.png"
];

return Promise.all(
images.map(src => {

return new Promise(resolve => {

const image = new Image();

image.onload = resolve;
image.onerror = resolve;

image.src = src;

});

})
);

}


/* =========================================================
LOADER
========================================================= */

async function bootLoader() {

const messages = [
"Finding the moon...",
"Waking the stars...",
"Lighting the forest...",
"Preparing a little surprise...",
"Almost there..."
];

let progress = 0;

const interval = setInterval(() => {

progress += random(3, 9);

progress = Math.min(progress, 94);

DOM.loaderBar.style.width = `${progress}%`;

const index = Math.min(
messages.length - 1,
Math.floor(progress / 20)
);

DOM.loaderStatus.textContent =
messages[index];

}, 180);

await preloadImages();

clearInterval(interval);

DOM.loaderBar.style.width = "100%";

DOM.loaderStatus.textContent =
"The night is ready.";

await wait(700);

DOM.loader.classList.add("loaded");

DOM.world.classList.add("ready");

DOM.world.setAttribute(
"aria-hidden",
"false"
);

}


/* =========================================================
STARS
========================================================= */

function createStars() {

const fragment =
document.createDocumentFragment();

for (let i = 0; i < 150; i++) { const star=document.createElement("span"); star.className="star" ; if (Math.random()>
    .78) {
    star.classList.add("large");
    }

    star.style.left =
    `${random(0, 100)}%`;

    star.style.top =
    `${random(0, 72)}%`;

    star.style.setProperty(
    "--duration",
    `${random(2, 6)}s`
    );

    star.style.animationDelay =
    `${random(-6, 0)}s`;

    fragment.appendChild(star);
    }

    DOM.stars.appendChild(fragment);

    }


    function createShootingStars() {

    for (let i = 0; i < 4; i++) { const star=document.createElement("div"); star.className="shooting-star" ;
        star.style.left=`${random(10, 80)}%`; star.style.top=`${random(5, 45)}%`; star.style.animationDelay=`${random(0,
        10)}s`; DOM.shootingStars.appendChild(star); } }
        /*=========================================================FIREFLIES=========================================================*/
        function createFireflies() { const fragment=document.createDocumentFragment(); for (let i=0; i < 35; i++) {
        const fly=document.createElement("span"); fly.className="firefly" ; fly.style.left=`${random(4, 96)}%`;
        fly.style.top=`${random(45, 88)}%`; fly.style.setProperty( "--x" , `${random(-60, 60)}px` );
        fly.style.setProperty( "--y" , `${random(-80, 80)}px` ); fly.style.setProperty( "--duration" , `${random(3,
        7)}s` ); fly.style.animationDelay=`${random(-7, 0)}s`; fragment.appendChild(fly); }
        DOM.fireflies.appendChild(fragment); }
        /*=========================================================SUBTITLE=========================================================*/
        let subtitleTimer=null; function subtitle(text, duration=3000) { clearTimeout(subtitleTimer);
        DOM.subtitle.textContent=text; DOM.subtitle.classList.add("show"); subtitleTimer=setTimeout(()=> {

        DOM.subtitle.classList.remove("show");

        }, duration);

        }


        /* =========================================================
        SCENE DIRECTOR
        ========================================================= */

        async function goToScene(name, chapterIndex) {

        const next =
        DOM.scenes[name];

        if (!next) {
        console.error(
        "[Birthday] Scene not found:",
        name
        );
        return;
        }

        const current =
        Object.values(DOM.scenes)
        .find(scene =>
        scene.classList.contains("active")
        );

        if (current === next) {
        return;
        }

        DOM.transition.classList.add("active");

        await wait(650);

        if (current) {

        current.classList.remove("active");
        current.classList.add("leaving");

        setTimeout(() => {
        current.classList.remove("leaving");
        }, 1500);

        current.setAttribute(
        "aria-hidden",
        "true"
        );

        }

        next.classList.add("active");

        next.setAttribute(
        "aria-hidden",
        "false"
        );

        state.chapter = chapterIndex;

        DOM.chapter.textContent =
        CONFIG.chapters[chapterIndex];

        updateProgress();

        await wait(250);

        DOM.transition.classList.remove("active");

        }


        /* =========================================================
        PROGRESS
        ========================================================= */

        function updateProgress() {

        const percentage =
        (state.chapter / 5) * 100;

        DOM.progress.style.width =
        `${percentage}%`;

        }


        /* =========================================================
        MUSIC
        ========================================================= */

        async function startMusic() {

        if (!DOM.music) {
        return;
        }

        if (!state.musicEnabled) {
        return;
        }

        DOM.music.volume =
        CONFIG.musicVolume;

        try {

        await DOM.music.play();

        state.musicStarted = true;

        DOM.soundSymbol.textContent = "♫";
        DOM.soundText.textContent = "SOUND ON";

        } catch (error) {

        console.warn(
        "[Birthday] Music waiting for user interaction."
        );

        }

        }


        async function toggleMusic() {

        if (!DOM.music) {
        return;
        }

        if (DOM.music.paused) {

        state.musicEnabled = true;

        await startMusic();

        } else {

        DOM.music.pause();

        state.musicEnabled = false;

        DOM.soundSymbol.textContent = "×";
        DOM.soundText.textContent = "SOUND OFF";

        }

        }


        /* =========================================================
        CHAPTER 1
        ========================================================= */

        async function startJourney() {

        if (state.introStarted) {
        return;
        }

        state.introStarted = true;

        await startMusic();

        subtitle(
        "Tonight, the stars have something to remember.",
        4500
        );

        await wait(700);

        await goToScene(
        "forest",
        1
        );

        subtitle(
        "There is a little light waiting somewhere ahead.",
        4000
        );

        }


        /* =========================================================
        CHAPTER 2
        ========================================================= */

        async function enterStars() {

        await goToScene(
        "stars",
        2
        );

        state.starsFound = 0;

        DOM.starCounter.textContent =
        "0";

        subtitle(
        "Five stars. Find them all.",
        4000
        );

        createInteractiveStars();

        }


        /* =========================================================
        INTERACTIVE STARS
        ========================================================= */

        function createInteractiveStars() {

        DOM.starField.innerHTML = "";

        const positions = [

        { x: 18, y: 52 },
        { x: 36, y: 68 },
        { x: 51, y: 45 },
        { x: 69, y: 62 },
        { x: 84, y: 39 }

        ];

        positions.forEach(
        (position, index) => {

        const star =
        document.createElement("button");

        star.className =
        "interactive-star";

        star.type = "button";

        star.setAttribute(
        "aria-label",
        `Find star ${index + 1}`
        );

        star.style.left =
        `${position.x}%`;

        star.style.top =
        `${position.y}%`;

        star.addEventListener(
        "click",
        () => collectStar(
        star,
        index
        )
        );

        DOM.starField.appendChild(star);

        }
        );

        }


        function collectStar(star, index) {

        if (star.classList.contains("found")) {
        return;
        }

        star.classList.add("found");

        state.starsFound++;

        DOM.starCounter.textContent =
        String(state.starsFound);

        createStarBurst(
        star
        );

        if (state.starsFound === 1) {

        subtitle(
        "One...",
        1200
        );

        } else if (state.starsFound === 3) {

        subtitle(
        "You're getting closer...",
        1800
        );

        } else if (
        state.starsFound ===
        state.totalStars
        ) {

        completeStarHunt();

        }

        }


        async function completeStarHunt() {

        DOM.starInstruction.textContent =
        "The constellation remembers.";

        subtitle(
        "You found them all. ✦",
        2500
        );

        await wait(2200);

        await goToScene(
        "gift",
        3
        );

        subtitle(
        "The stars were leading you here.",
        3500
        );

        }


        /* =========================================================
        STAR PARTICLE BURST
        ========================================================= */

        function createStarBurst(element) {

        const rect =
        element.getBoundingClientRect();

        for (let i = 0; i < 12; i++) { const particle=document.createElement("span"); particle.textContent="✦" ;
            particle.style.position="fixed" ; particle.style.left=`${rect.left + rect.width / 2}px`;
            particle.style.top=`${rect.top + rect.height / 2}px`; particle.style.zIndex="400" ;
            particle.style.pointerEvents="none" ; particle.style.color="white" ; particle.style.fontSize=`${random(7,
            14)}px`; particle.style.transition="transform 900ms ease, opacity 900ms ease" ; document.body.appendChild(
            particle ); requestAnimationFrame(()=> {

            particle.style.transform =
            `translate(
            ${random(-100, 100)}px,
            ${random(-100, 100)}px
            ) scale(.2)`;

            particle.style.opacity =
            "0";

            });

            setTimeout(() => {
            particle.remove();
            }, 1000);

            }

            }


            /* =========================================================
            GIFT
            ========================================================= */

            async function openGift() {

            if (state.giftOpened) {
            return;
            }

            state.giftOpened = true;

            DOM.gift.classList.add("open");

            DOM.giftHint.style.opacity =
            "0";

            subtitle(
            "A little surprise...",
            2200
            );

            await wait(1600);

            await goToScene(
            "letter",
            4
            );

            subtitle(
            "Some things are better written than said.",
            3500
            );

            }


            /* =========================================================
            LETTER
            ========================================================= */

            async function openLetter() {

            if (state.letterOpened) {
            return;
            }

            state.letterOpened = true;

            DOM.letterButton.style.display =
            "none";

            await typeLetter();

            await wait(1800);

            subtitle(
            "And now... one last thing.",
            3000
            );

            await wait(2500);

            startFinale();

            }


            async function typeLetter() {

            DOM.letterText.textContent =
            "";

            const text =
            CONFIG.letter;

            let index = 0;

            const speed = 27;

            return new Promise(resolve => {

            const timer =
            setInterval(() => {

            DOM.letterText.textContent =
            text.slice(0, index);

            index++;

            if (index > text.length) {

            clearInterval(timer);

            resolve();

            }

            }, speed);

            });

            }


            /* =========================================================
            FINALE
            ========================================================= */

            async function startFinale() {

            if (state.finaleStarted) {
            return;
            }

            state.finaleStarted = true;

            DOM.birthdayName.textContent =
            CONFIG.birthdayName;

            DOM.birthdayMessage.textContent =
            CONFIG.birthdayMessage;

            await goToScene(
            "ending",
            5
            );

            DOM.progress.style.width =
            "100%";

            subtitle(
            "Happy Birthday. ✦",
            5000
            );

            startFireworks();

            }


            /* =========================================================
            FIREWORKS
            ========================================================= */

            function setupFireworks() {

            const canvas =
            DOM.fireworks;

            const ctx =
            canvas.getContext("2d");

            function resize() {

            const dpr =
            Math.min(
            window.devicePixelRatio || 1,
            2
            );

            canvas.width =
            window.innerWidth * dpr;

            canvas.height =
            window.innerHeight * dpr;

            canvas.style.width =
            `${window.innerWidth}px`;

            canvas.style.height =
            `${window.innerHeight}px`;

            ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
            );

            }

            resize();

            window.addEventListener(
            "resize",
            resize
            );

            function loop() {

            ctx.fillStyle =
            "rgba(3,5,12,.18)";

            ctx.fillRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
            );

            updateFireworks(ctx);

            requestAnimationFrame(loop);

            }

            loop();

            }


            function createFirework() {

            const x =
            random(
            window.innerWidth * .15,
            window.innerWidth * .85
            );

            const y =
            random(
            window.innerHeight * .15,
            window.innerHeight * .52
            );

            const hue =
            random(190, 340);

            const particles = [];

            for (let i = 0; i < 65; i++) { const angle=(Math.PI * 2 * i) / 65; const velocity=random(1.5, 5);
                particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, life: 1, decay:
                random(.008, .018), size: random(1, 2.8), hue }); } state.fireworks.push( particles ); } function
                updateFireworks(ctx) { for ( let groupIndex=state.fireworks.length - 1; groupIndex>= 0;

                groupIndex--
                ) {

                const group =
                state.fireworks[groupIndex];

                for (
                let i = group.length - 1;

                i >= 0;

                i--
                ) {

                const p =
                group[i];

                p.x += p.vx;
                p.y += p.vy;

                p.vy += .025;

                p.life -= p.decay;

                if (p.life <= 0) { group.splice(i, 1); continue; } ctx.beginPath(); ctx.arc( p.x, p.y, p.size, 0,
                    Math.PI * 2 ); ctx.fillStyle=`hsla( ${p.hue}, 80%, 82%, ${p.life} )`; ctx.shadowBlur=14;
                    ctx.shadowColor=`hsla( ${p.hue}, 80%, 80%, .8 )`; ctx.fill(); } if (group.length===0) {
                    state.fireworks.splice( groupIndex, 1 ); } } } let fireworksTimer=null; function startFireworks() {
                    setupFireworks(); createFirework(); fireworksTimer=setInterval(()=> {

                    createFirework();

                    }, 1300);

                    }


                    /* =========================================================
                    CINEMATIC KEYBOARD CONTROL
                    ========================================================= */

                    function keyboardControls() {

                    document.addEventListener(
                    "keydown",
                    event => {

                    if (
                    event.key === "Enter" ||
                    event.key === " "
                    ) {

                    const active =
                    Object.entries(
                    DOM.scenes
                    ).find(
                    ([, scene]) =>
                    scene.classList
                    .contains("active")
                    );

                    if (!active) {
                    return;
                    }

                    const [name] =
                    active;

                    if (name === "intro") {
                    startJourney();
                    }

                    else if (name === "forest") {
                    enterStars();
                    }

                    else if (name === "gift") {
                    openGift();
                    }

                    else if (name === "letter") {
                    openLetter();
                    }

                    }

                    }
                    );

                    }


                    /* =========================================================
                    MOUSE PARALLAX
                    ========================================================= */

                    function setupParallax() {

                    if (
                    window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                    ).matches
                    ) {
                    return;
                    }

                    let targetX = 0;
                    let targetY = 0;

                    let currentX = 0;
                    let currentY = 0;

                    window.addEventListener(
                    "pointermove",
                    event => {

                    targetX =
                    (event.clientX /
                    window.innerWidth -
                    .5) * 2;

                    targetY =
                    (event.clientY /
                    window.innerHeight -
                    .5) * 2;

                    },
                    { passive: true }
                    );


                    function animate() {

                    currentX +=
                    (targetX - currentX) *
                    .025;

                    currentY +=
                    (targetY - currentY) *
                    .025;

                    DOM.background.style.transform =
                    `scale(1.06)
                    translate(
                    ${currentX * -7}px,
                    ${currentY * -5}px
                    )`;

                    DOM.moon.parentElement.style.transform =
                    `translate(
                    ${currentX * 12}px,
                    ${currentY * 8}px
                    )`;

                    requestAnimationFrame(
                    animate
                    );

                    }

                    animate();

                    }


                    /* =========================================================
                    EVENT LISTENERS
                    ========================================================= */

                    function bindEvents() {

                    DOM.begin.addEventListener(
                    "click",
                    startJourney
                    );

                    DOM.forestButton.addEventListener(
                    "click",
                    enterStars
                    );

                    DOM.gift.addEventListener(
                    "click",
                    openGift
                    );

                    DOM.letterButton.addEventListener(
                    "click",
                    openLetter
                    );

                    DOM.soundButton.addEventListener(
                    "click",
                    toggleMusic
                    );

                    }


                    /* =========================================================
                    INITIALIZE
                    ========================================================= */

                    async function initialize() {

                    if (state.initialized) {
                    return;
                    }

                    state.initialized = true;

                    createStars();

                    createShootingStars();

                    createFireflies();

                    bindEvents();

                    keyboardControls();

                    setupParallax();

                    DOM.music.volume =
                    CONFIG.musicVolume;

                    updateProgress();

                    await bootLoader();

                    console.log(
                    "✦ When The Stars Remember — Cinematic Director Ready"
                    );

                    }


                    /* =========================================================
                    START
                    ========================================================= */

                    if (
                    document.readyState ===
                    "loading"
                    ) {

                    document.addEventListener(
                    "DOMContentLoaded",
                    initialize,
                    { once: true }
                    );

                    } else {

                    initialize();

                    }

                    })();
