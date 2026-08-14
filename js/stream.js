/* =====================================================
   LETS GO ANIME
   STREAM PAGE
===================================================== */

import { supabase } from "./supabase.js";


/* =====================================================
   ELEMENTS
===================================================== */

const grid =
    document.getElementById("animeGrid");

const episodesSection =
    document.getElementById("episodes");

const animeName =
    document.getElementById("animeName");

const episodeList =
    document.getElementById("episodeList");

const videoModal =
    document.getElementById("videoModal");

const player =
    document.getElementById("player");

const searchInput =
    document.getElementById("search");

const searchBtn =
    document.getElementById("searchBtn");

const backBtn =
    document.getElementById("backBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const featuredBtn =
    document.getElementById("featuredBtn");


/* =====================================================
   DATA
===================================================== */

let animeData = [];

let latestAnime = null;


/* =====================================================
   FALLBACK ANIME
   These remain visible until you add them
   to the Supabase anime table.
===================================================== */

const fallbackAnime = [

    {
        id: "naruto-fallback",

        title: "Naruto",

        description:
            "Naruto Uzumaki dreams of becoming the strongest ninja and earning the title of Hokage.",

        image_url: "",

        isFallback: true
    },

    {
        id: "demon-slayer-fallback",

        title: "Demon Slayer",

        description:
            "Tanjiro battles demons while protecting his sister.",

        image_url: "",

        isFallback: true
    },

    {
        id: "attack-on-titan-fallback",

        title: "Attack On Titan",

        description:
            "Humanity fights against terrifying Titans.",

        image_url: "",

        isFallback: true
    },

    {
        id: "bleach-fallback",

        title: "Bleach",

        description:
            "Ichigo becomes a Soul Reaper.",

        image_url: "",

        isFallback: true
    },

    {
        id: "one-piece-fallback",

        title: "One Piece",

        description:
            "Luffy searches for the legendary One Piece treasure.",

        image_url: "",

        isFallback: true
    },

    {
        id: "highschool-dxd-fallback",

        title: "Highschool DxD",

        description:
            "A supernatural adventure involving demons and angels.",

        image_url: "",

        isFallback: true
    },

    {
        id: "jujutsu-kaisen-fallback",

        title: "Jujutsu Kaisen",

        description:
            "A young sorcerer enters a dangerous world of curses.",

        image_url: "",

        isFallback: true
    }

];


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadAnime
);


/* =====================================================
   LOAD ANIME FROM SUPABASE
===================================================== */

async function loadAnime() {

    if (!grid) {
        console.error("animeGrid was not found.");
        return;
    }


    grid.innerHTML = `
        <div class="loading-message">
            <p>Loading anime...</p>
        </div>
    `;


    const {
        data,
        error
    } = await supabase

        .from("anime")

        .select(
            "id, created_at, title, description, image_url"
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Anime loading error:",
            error
        );


        animeData =
            fallbackAnime;


        latestAnime =
            fallbackAnime[0];


        displayAnime(
            animeData
        );


        return;
    }


    console.log(
        "Anime loaded from Supabase:",
        data
    );


    const databaseAnime =
        (data || []).map(
            anime => ({

                id:
                    anime.id,

                title:
                    anime.title,

                description:
                    anime.description || "",

                image_url:
                    anime.image_url || "",

                created_at:
                    anime.created_at,

                isFallback:
                    false

            })
        );


    /*
     * Latest anime
     */

    latestAnime =
        databaseAnime.length > 0
            ? databaseAnime[0]
            : fallbackAnime[0];


    /*
     * Avoid displaying Naruto twice.
     * If Naruto exists in Supabase,
     * remove the fallback Naruto card.
     */

    const databaseTitles =
        databaseAnime.map(
            anime =>
                anime.title
                    .trim()
                    .toLowerCase()
        );


    const extraAnime =
        fallbackAnime.filter(
            anime =>
                !databaseTitles.includes(
                    anime.title
                        .trim()
                        .toLowerCase()
                )
        );


    animeData = [

        ...databaseAnime,

        ...extraAnime

    ];


    displayAnime(
        animeData
    );

}


/* =====================================================
   DISPLAY ANIME CARDS
===================================================== */

function displayAnime(list) {

    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (
        !list ||
        list.length === 0
    ) {

        grid.innerHTML = `
            <div class="empty-message">

                <h2>
                    No anime found
                </h2>

                <p>
                    Try searching for another anime.
                </p>

            </div>
        `;

        return;
    }


    list.forEach(
        anime => {

            const card =
                document.createElement("div");


            card.className =
                "card anime-card";


            /* =================================================
               IMAGE
            ================================================= */

            if (
                anime.image_url &&
                anime.image_url.trim() !== ""
            ) {

                const image =
                    document.createElement("img");


                image.src =
                    anime.image_url;

                image.alt =
                    anime.title;

                image.loading =
                    "lazy";


                card.appendChild(
                    image
                );

            }


            /* =================================================
               CONTENT
            ================================================= */

            const content =
                document.createElement("div");


            content.className =
                "card-content";


            const title =
                document.createElement("h2");


            title.textContent =
                anime.title;


            const description =
                document.createElement("p");


            description.textContent =
                anime.description;


            const button =
                document.createElement("button");


            button.className =
                "btn primary";


            button.type =
                "button";


            button.textContent =
                "Episodes";


            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    showEpisodes(
                        anime
                    );

                }
            );


            content.appendChild(
                title
            );


            content.appendChild(
                description
            );


            content.appendChild(
                button
            );


            card.appendChild(
                content
            );


            /* =================================================
               CLICK CARD
            ================================================= */

            card.addEventListener(
                "click",
                () => {

                    showEpisodes(
                        anime
                    );

                }
            );


            grid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   SHOW EPISODES
===================================================== */

async function showEpisodes(
    anime
) {

    if (!episodesSection) {
        return;
    }


    grid.style.display =
        "none";


    episodesSection.style.display =
        "block";


    animeName.textContent =
        anime.title;


    episodeList.innerHTML = `
        <div class="loading-message">
            <p>Loading episodes...</p>
        </div>
    `;


    console.log(
        "Selected anime:",
        anime
    );


    /* =================================================
       REAL SUPABASE ANIME
    ================================================= */

    if (
        anime.isFallback === false
    ) {

        await loadEpisodes(
            anime.id
        );

        return;
    }


    /* =================================================
       FALLBACK ANIME
       Find it in Supabase using title.
    ================================================= */

    const {
        data,
        error
    } = await supabase

        .from("anime")

        .select(
            "id, title"
        )

        .ilike(
            "title",
            anime.title.trim()
        )

        .limit(1);


    if (error) {

        console.error(
            "Finding anime failed:",
            error
        );


        showNoEpisodes();


        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        showNoEpisodes();


        return;
    }


    console.log(
        "Found Supabase anime:",
        data[0]
    );


    await loadEpisodes(
        data[0].id
    );

}


/* =====================================================
   LOAD EPISODES FROM SUPABASE
===================================================== */

async function loadEpisodes(
    animeId
) {

    console.log(
        "================================"
    );


    console.log(
        "LOADING EPISODES"
    );


    console.log(
        "Anime ID:",
        animeId
    );


    console.log(
        "================================"
    );


    const {
        data,
        error
    } = await supabase

        .from("episodes")

        .select(
            "id, anime_id, episode_number, title, video_url"
        )

        .eq(
            "anime_id",
            animeId
        )

        .order(
            "episode_number",
            {
                ascending: true
            }
        );


    console.log(
        "EPISODE DATA:",
        data
    );


    console.log(
        "EPISODE ERROR:",
        error
    );


    /* =================================================
       DATABASE ERROR
    ================================================= */

    if (error) {

        console.error(
            "Episode loading error:",
            error
        );


        episodeList.innerHTML = `

            <div class="empty-message">

                <h2>
                    Unable to load episodes
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;


        return;
    }


    /* =================================================
       NO RESULTS
    ================================================= */

    if (
        !data ||
        data.length === 0
    ) {

        episodeList.innerHTML = `

            <div class="empty-message">

                <h2>
                    No episodes available
                </h2>

                <p>
                    Supabase returned no episodes for this anime.
                </p>

                <small>
                    Anime ID:
                    ${animeId}
                </small>

            </div>

        `;


        return;
    }


    /* =================================================
       DISPLAY
    ================================================= */

    displayEpisodes(
        data
    );

}


/* =====================================================
   DISPLAY EPISODES
===================================================== */

function displayEpisodes(
    episodes
) {

    episodeList.innerHTML = "";


    episodes.forEach(
        episode => {

            const row =
                document.createElement("div");


            row.className =
                "episode";


            /* =================================================
               TITLE
            ================================================= */

            const title =
                document.createElement("span");


            title.textContent =
                episode.title &&
                episode.title.trim() !== ""

                    ? episode.title

                    : `Episode ${episode.episode_number}`;


            /* =================================================
               WATCH BUTTON
            ================================================= */

            const button =
                document.createElement("button");


            button.className =
                "btn primary";


            button.type =
                "button";


            button.textContent =
                "Watch";


            button.addEventListener(
                "click",
                () => {

                    openPlayer(
                        episode.video_url
                    );

                }
            );


            row.appendChild(
                title
            );


            row.appendChild(
                button
            );


            episodeList.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   NO EPISODES
===================================================== */

function showNoEpisodes() {

    episodeList.innerHTML = `

        <div class="empty-message">

            <h2>
                No episodes available
            </h2>

            <p>
                Episodes for this anime haven't been added yet.
            </p>

        </div>

    `;

}


/* =====================================================
   OPEN MP4 PLAYER
===================================================== */

function openPlayer(
    videoUrl
) {

    if (
        !videoUrl ||
        videoUrl.trim() === ""
    ) {

        alert(
            "This episode does not have a video URL."
        );


        return;
    }


    console.log(
        "================================"
    );


    console.log(
        "PLAYING VIDEO"
    );


    console.log(
        videoUrl
    );


    console.log(
        "================================"
    );


    /* =================================================
       OPEN MODAL
    ================================================= */

    videoModal.style.display =
        "flex";


    /* =================================================
       LOAD SUPABASE MP4
    ================================================= */

    player.src =
        videoUrl;


    player.load();


    /*
     * Don't force autoplay.
     *
     * The browser can block autoplay.
     * The user can simply press Play.
     */


}


/* =====================================================
   CLOSE VIDEO PLAYER
===================================================== */

function closePlayer() {

    if (!player) {
        return;
    }


    player.pause();


    player.removeAttribute(
        "src"
    );


    player.load();


    videoModal.style.display =
        "none";

}


/* =====================================================
   BACK TO ANIME
===================================================== */

function backHome() {

    closePlayer();


    episodesSection.style.display =
        "none";


    grid.style.display =
        "grid";

}


/* =====================================================
   SEARCH
===================================================== */

function searchAnime() {

    if (!searchInput) {
        return;
    }


    const value =
        searchInput.value
            .trim()
            .toLowerCase();


    /* =================================================
       EMPTY SEARCH
    ================================================= */

    if (!value) {

        displayAnime(
            animeData
        );


        return;
    }


    /* =================================================
       FILTER
    ================================================= */

    const results =
        animeData.filter(
            anime => {

                const title =
                    (
                        anime.title || ""
                    )
                        .toLowerCase();


                const description =
                    (
                        anime.description || ""
                    )
                        .toLowerCase();


                return (

                    title.includes(
                        value
                    )

                    ||

                    description.includes(
                        value
                    )

                );

            }
        );


    displayAnime(
        results
    );


    episodesSection.style.display =
        "none";


    grid.style.display =
        "grid";

}


/* =====================================================
   FEATURED ANIME
===================================================== */

function openFeatured() {

    if (
        latestAnime
    ) {

        showEpisodes(
            latestAnime
        );

    }

}


/* =====================================================
   EVENT LISTENERS
===================================================== */

/*
 * Search
 */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchAnime
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                searchAnime();

            }

        }
    );

}


/*
 * Featured
 */

if (featuredBtn) {

    featuredBtn.addEventListener(
        "click",
        openFeatured
    );

}


/*
 * Back
 */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        backHome
    );

}


/*
 * Close modal
 */

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closePlayer
    );

}


/*
 * Click outside modal
 */

if (videoModal) {

    videoModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                videoModal
            ) {

                closePlayer();

            }

        }
    );

}


/*
 * Escape key
 */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closePlayer();

        }

    }
);


/* =====================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
===================================================== */

window.searchAnime =
    searchAnime;


window.openFeatured =
    openFeatured;


window.backHome =
    backHome;


window.closePlayer =
    closePlayer;


window.openPlayer =
    openPlayer;