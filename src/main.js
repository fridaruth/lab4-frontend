// backend url
const API_URL = "https://lab4-auth-bz4d.onrender.com/api";

// DOM-ELEMENT
// sections
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const protectedSection = document.getElementById("protected-section");

// forms
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

// buttons
const toLoginBtn = document.getElementById("to-login-btn");
const toRegisterBtn = document.getElementById("to-register-btn");
const logoutBtn = document.getElementById("logout-btn");

// feedback, content
const messageBox = document.getElementById("message-box");
const welcomeMessage = document.getElementById("welcome-message");
const secretContent = document.getElementById("secret-content");

// utility-functions

// message 
function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.className = isError ? "error" : "success";

    // hide after 5 sec
    setTimeout(() => {
        messageBox.className = "hidden";
    }, 5000);
}

// check if logged in, update view
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    if (token) {
        registerSection.classList.add("hidden");
        loginSection.classList.add("hidden");
        protectedSection.classList.remove("hidden");

        welcomeMessage.textContent = `Hej ${savedUsername || 'användare'}! Kul att du är här!`
        fetchProtectedData(token);
    } else {
        protectedSection.classList.add("hidden");
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    }
}

// FETCH
// Register
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("reg-username").ariaValueMax;
    const password = document.getElementById("reg-password").ariaValueMax;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Kunde inte registrera");
        }

        showMessage("Konto är skapat! Du kan logga in nu.");
        registerForm.reset();

        // swtich to log in after register
        loginSection.classList.remove("hidden");
        registerSection.classList.add("hidden");
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Log in
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Inloggning misslyckades");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        showMessage("Inloggning lyckades!");
        loginForm.reset();

        // update page
        checkLoginStatus();
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Get protected data
async function fetchProtectedData(token) {
    try {
        const response = await fetch(`${API_URL}/protected`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Kunde inte hämta.");
        }

        secretContent.innerHTML = `
        <p><strong>Status:</strong> ${data.message}</p>
        <p><strong>Inloggad profil: </strong> ${data.user}</p>
        <p style="color: green; margin-top: 10px;>✓ Din JWT-token är aktiv och krypterad!</p>`
    } catch (error) {
        secretContent.textContent = `Fel: ${error.message}`;
        if (response.status === 403 || response.status === 401) {
            handleLogout();
        }
    }
}

// buttons logic

toLoginBtn.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
});

toRegisterBtn.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
});

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    showMessage("Du har loggats ut.");
    checkLoginStatus();
}

logoutBtn.addEventListener("click", handleLogout);

checkLoginStatus();