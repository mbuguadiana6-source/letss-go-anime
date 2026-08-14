import { supabase } from "./supabase.js";


/* =========================
   SIGN UP
========================= */

const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const displayName =
            document.getElementById("display-name").value.trim();

        const email =
            document.getElementById("signup-email").value.trim();

        const password =
            document.getElementById("signup-password").value;


        signupMessage.textContent = "Creating account...";


        const { data, error } = await supabase.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {
                    username: username,
                    display_name: displayName
                }

            }

        });


        if (error) {

            console.error("Signup error:", error);

            signupMessage.textContent = error.message;

            return;

        }


        console.log("Signup successful:", data);

        signupMessage.textContent =
            "Account created successfully!";


        signupForm.reset();

    });

}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;


        loginMessage.textContent = "Logging in...";


        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error("Login error:", error);

            loginMessage.textContent = error.message;

            return;

        }


        console.log("Login successful:", data);

        loginMessage.textContent =
            "Login successful!";

        updateUserStatus();

    });

}


/* =========================
   CHECK CURRENT USER
========================= */

async function updateUserStatus() {

    const userStatus =
        document.getElementById("user-status");

    const logoutButton =
        document.getElementById("logout-button");


    const {
        data: { user }
    } = await supabase.auth.getUser();


    if (user) {

        userStatus.textContent =
            `Logged in as ${user.email}`;

        logoutButton.hidden = false;

    } else {

        userStatus.textContent =
            "You are not logged in.";

        logoutButton.hidden = true;

    }

}


/* =========================
   LOGOUT
========================= */

const logoutButton =
    document.getElementById("logout-button");


if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        const { error } =
            await supabase.auth.signOut();


        if (error) {

            console.error("Logout error:", error);

            return;

        }


        updateUserStatus();

        const loginMessage =
            document.getElementById("login-message");

        if (loginMessage) {

            loginMessage.textContent =
                "You have been logged out.";

        }

    });

}


/* =========================
   INITIAL SESSION CHECK
========================= */

updateUserStatus();