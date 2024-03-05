import { createApp } from "vue";
import App from "./App.vue";
import BaseButton from "./components/BaseButton.vue";
import FormInput from "./components/FormInput.vue";
import BaseModal from "./components/BaseModal.vue";
import router from "./router";
import store from "./store"; // Import the store
import "./assets/styles/index.css";
import "./assets/main.css"; // Adjust the path according to your file structure
import axios from "axios";

// Setup axios defaults
axios.defaults.baseURL = "http://localhost:3000";
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  config.headers.Authorization = user ? `Bearer ${user.token}` : "";
  return config;
});

const app = createApp(App).use(router).use(store);

// Register global components here
app.component("BaseButton", BaseButton);
app.component("FormInput", FormInput);
app.component("BaseModal", BaseModal);

// Mount the Vue app
app.mount("#app");

function initGoogleSignIn() {
  window.google.accounts.id.initialize({
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    callback: onSignIn,
  });
  window.google.accounts.id.renderButton(
    document.getElementById("google-signin-btn"), // Ensure you have a placeholder element with this ID
    { theme: "outline", size: "large" } // Customization options
  );
}

// Callback function to handle sign-in data
function onSignIn(response) {
  console.log("Google Sign-In response", response);
  // Process sign-in data, verify token on your backend, etc.
}

setTimeout(() => {
  if (window.google) {
    initGoogleSignIn();
  }
}, 100);
