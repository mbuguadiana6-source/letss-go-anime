document.addEventListener("DOMContentLoaded", async () => {

    const isAdminPage = window.location.pathname.includes("/admin/");

    const basePath = isAdminPage ? "../" : "./";


    /* =========================
       LOAD NAVBAR
    ========================= */

    const navbarContainer = document.getElementById("navbar");

    if (navbarContainer) {

        try {

            const response = await fetch(
                basePath + "components/navbar.html"
            );

            if (!response.ok) {
                throw new Error("Navbar could not be loaded.");
            }

            navbarContainer.innerHTML = await response.text();

        } catch (error) {

            console.error("Navbar error:", error);

        }

    }


    /* =========================
       LOAD FOOTER
    ========================= */

    const footerContainer = document.getElementById("footer");

    if (footerContainer) {

        try {

            const response = await fetch(
                basePath + "components/footer.html"
            );

            if (!response.ok) {
                throw new Error("Footer could not be loaded.");
            }

            footerContainer.innerHTML = await response.text();

        } catch (error) {

            console.error("Footer error:", error);

        }

    }


    /* =========================
       LOAD PROFILE
    ========================= */

    loadProfile();

});



/* =========================
   PROFILE
========================= */

async function loadProfile() {

    const defaultImage =
        "images/default-profile.png";


    try {

        const module =
            await import("./supabase.js");


        const supabase =
            module.supabase;


        if (!supabase) {
            return;
        }


        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();


        const profileImage =
            document.getElementById("profileImage");

        const profileLink =
            document.getElementById("profileLink");


        if (!profileImage || !profileLink) {
            return;
        }


        /* USER NOT LOGGED IN */

        if (!user) {

            profileImage.src =
                defaultImage;

            profileLink.href =
                "auth.html";

            return;

        }


        /* USER LOGGED IN */

        profileLink.href =
            "auth.html";


        /*
         Profile picture can come from
         Supabase user metadata.
        */

        const avatar =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.profile_picture;


        if (avatar) {

            profileImage.src =
                avatar;

        } else {

            profileImage.src =
                defaultImage;

        }

    } catch (error) {

        console.log(
            "Profile could not be loaded:",
            error
        );

    }

}