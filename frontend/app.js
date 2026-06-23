const state = {
    token: localStorage.getItem("phonebookToken") || "",
    contacts: [],
    editingId: ""
};

const authPanel = document.querySelector("#authPanel");
const contactsPanel = document.querySelector("#contactsPanel");
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const contactForm = document.querySelector("#contactForm");
const contactsGrid = document.querySelector("#contactsGrid");
const contactTemplate = document.querySelector("#contactTemplate");
const authStatusLine = document.querySelector("#authStatusLine");
const statusLine = document.querySelector("#statusLine");
const searchInput = document.querySelector("#searchInput");
const logoutButton = document.querySelector("#logoutButton");
const refreshButton = document.querySelector("#refreshButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const saveContactButton = document.querySelector("#saveContactButton");

const API_BASE = "https://phonebook-kyfw.onrender.com";

function setAuthStatus(message, type = "") {
    authStatusLine.textContent = message;
    authStatusLine.className = `status-line auth-status ${type}`.trim();
}

function setContactStatus(message, type = "") {
    statusLine.textContent = message;
    statusLine.className = `status-line ${type}`.trim();
}

function switchAuthMode(mode) {
    const isLogin = mode === "login";
    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);
    loginForm.classList.toggle("active", isLogin);
    registerForm.classList.toggle("active", !isLogin);
}

function showApp(isAuthenticated) {
    authPanel.classList.toggle("hidden", isAuthenticated);
    contactsPanel.classList.toggle("hidden", !isAuthenticated);
    contactForm.classList.toggle("active", isAuthenticated);

    if (isAuthenticated) {
        loadContacts();
    }
}

async function apiRequest(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (state.token) {
        headers.Authorization = `Bearer ${state.token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers
        });
    } catch (error) {
        throw new Error("Cannot reach the API. Start the backend server and check browser CORS access.");
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

function getFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
}

async function handleLogin(event) {
    event.preventDefault();

    try {
        const data = await apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(getFormData(loginForm))
        });

        state.token = data.token;
        localStorage.setItem("phonebookToken", data.token);
        loginForm.reset();
        showApp(true);
        setContactStatus("Logged in successfully.", "success");
        setAuthStatus("");
    } catch (error) {
        setAuthStatus(error.message, "error");
    }
}

async function handleRegister(event) {
    event.preventDefault();

    try {
        await apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(getFormData(registerForm))
        });

        registerForm.reset();
        switchAuthMode("login");
        setAuthStatus("Account created. Login with your email and password.", "success");
    } catch (error) {
        setAuthStatus(error.message, "error");
    }
}

async function loadContacts() {
    setContactStatus("Loading contacts...");

    try {
        state.contacts = await apiRequest("/api/contacts");
        renderContacts();
    } catch (error) {
        setContactStatus(error.message, "error");
    }
}

async function saveContact(event) {
    event.preventDefault();

    const formData = getFormData(contactForm);
    const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim()
    };

    try {
        if (state.editingId) {
            await apiRequest(`/api/contacts/${state.editingId}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            setContactStatus("Contact updated.", "success");
        } else {
            await apiRequest("/api/contacts", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setContactStatus("Contact added.", "success");
        }

        resetContactForm();
        await loadContacts();
    } catch (error) {
        setContactStatus(error.message, "error");
    }
}

async function deleteContact(id) {
    const contact = state.contacts.find((item) => item._id === id);
    const name = contact ? contact.name : "this contact";

    if (!confirm(`Delete ${name}?`)) {
        return;
    }

    try {
        await apiRequest(`/api/contacts/${id}`, {
            method: "DELETE"
        });
        state.contacts = state.contacts.filter((item) => item._id !== id);
        renderContacts();
        setContactStatus("Contact deleted.", "success");
    } catch (error) {
        setContactStatus(error.message, "error");
    }
}

function editContact(id) {
    const contact = state.contacts.find((item) => item._id === id);

    if (!contact) {
        return;
    }

    contactForm.elements.id.value = contact._id;
    contactForm.elements.name.value = contact.name;
    contactForm.elements.phone.value = contact.phone;
    state.editingId = contact._id;
    saveContactButton.textContent = "Update contact";
    cancelEditButton.classList.remove("hidden");
    contactForm.elements.name.focus();
}

function resetContactForm() {
    contactForm.reset();
    state.editingId = "";
    saveContactButton.textContent = "Add contact";
    cancelEditButton.classList.add("hidden");
}

function renderContacts() {
    const query = searchInput.value.trim().toLowerCase();
    const filteredContacts = state.contacts.filter((contact) => {
        const name = contact.name.toLowerCase();
        const phone = contact.phone.toLowerCase();
        return name.includes(query) || phone.includes(query);
    });

    contactsGrid.innerHTML = "";

    if (!filteredContacts.length) {
        setContactStatus(query ? "No contacts match your search." : "No contacts yet. Add your first one.", "");
        return;
    }

    filteredContacts.forEach((contact) => {
        const card = contactTemplate.content.firstElementChild.cloneNode(true);
        card.querySelector("h3").textContent = contact.name;
        card.querySelector("p").textContent = contact.phone;
        card.querySelector(".edit-button").addEventListener("click", () => editContact(contact._id));
        card.querySelector(".delete-button").addEventListener("click", () => deleteContact(contact._id));
        contactsGrid.appendChild(card);
    });

    setContactStatus(`${filteredContacts.length} contact${filteredContacts.length === 1 ? "" : "s"} shown.`, "success");
}

function logout() {
    state.token = "";
    state.contacts = [];
    localStorage.removeItem("phonebookToken");
    resetContactForm();
    setAuthStatus("");
    setContactStatus("");
    showApp(false);
}

loginTab.addEventListener("click", () => switchAuthMode("login"));
registerTab.addEventListener("click", () => switchAuthMode("register"));
loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);
contactForm.addEventListener("submit", saveContact);
searchInput.addEventListener("input", renderContacts);
refreshButton.addEventListener("click", loadContacts);
cancelEditButton.addEventListener("click", resetContactForm);
logoutButton.addEventListener("click", logout);

showApp(Boolean(state.token));
