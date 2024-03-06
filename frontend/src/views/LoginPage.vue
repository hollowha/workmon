<template>
    <div>
        <NavBar />
        <main class="container">
            <div class="grid">
                <section v-if="isLoginVisible">
                    <h2>Login</h2>
                    <form @submit.prevent="login">
                        <FormInput type="email" id="login-email" v-model="loginEmail" label="Email" required />
                        <FormInput type="password" id="login-password" v-model="loginPassword" label="Password"
                            required />
                        <button type="submit"
                            class="bg-f29d7f hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Login</button>
                    </form>
                    <!-- <div id="google-signin-btn"></div> -->
                    <button @click="toSwitchPage"
                        class="bg-fab3a5 hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Change
                        to Register</button>
                </section>
                <section v-else>
                    <h2>Register</h2>
                    <form @submit.prevent="register">
                        <FormInput type="email" id="register-email" v-model="registerEmail" label="Email" required />
                        <FormInput type="password" id="register-password" v-model="registerPassword" label="Password"
                            required />
                        <FormInput type="password" id="register-confirm-password" v-model="registerConfirmPassword"
                            label="Confirm Password" required />
                        <button type="submit"
                            class="bg-f29d7f hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Register</button>
                    </form>
                    <button @click="toSwitchPage"
                        class="bg-fab3a5 hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Change
                        to Login</button>
                </section>
            </div>

            <div id="google-signin-btn"></div>
        </main>
        <Footer />
    </div>
</template>


<script>
// import axios from 'axios'; // Import axios
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';
import FormInput from '@/components/FormInput.vue';
import axios from 'axios';

import AuthService from '@/service/authService';

import { onMounted } from 'vue';

export default {
    components: {
        NavBar,
        Footer,
        FormInput,
    },
    data() {
        return {
            isLoginVisible: true,
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmPassword: '',
        };
    },
    setup() {
        onMounted(() => {
            loadGoogleApi().then(() => {
                google.accounts.id.initialize({
                    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById('google-signin-btn'),
                    { theme: 'outline', size: 'large' }
                );
            }).catch(error => {
                console.error("Failed to load Google API", error);
                // 可以在这里处理加载失败的情况，例如显示错误消息
            });
        });

        function handleCredentialResponse(response) {
            console.log('Encoded JWT ID token: ' + response.credential);
            // Here, send the response.credential (JWT ID token) to your backend for verification
            // and further processing, e.g., logging the user in or creating an account
        }

        function loadGoogleApi() {
            return new Promise((resolve) => {
                if (typeof gapi === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://apis.google.com/js/platform.js';
                    script.onload = () => {
                        gapi.load('auth2', resolve);
                    };
                    document.body.appendChild(script);
                } else {
                    resolve();
                }
            });
        }
    },
    mounted() {
        // 確保 gapi 腳本已加載
        this.loadGoogleApi().then(() => {
            // 安全調用 gapi.auth2.getAuthInstance()
            // const authInstance = gapi.auth2.getAuthInstance();
            if (!window.gapi.auth2.getAuthInstance()) {
                window.gapi.load('auth2', () => {
                    window.gapi.auth2.init({
                        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
                        // client_id: "690015128683-dgepaq538g5inde7si0gsuqi67vhcd7l.apps.googleusercontent.com"
                    });
                });
            } else {
                // const authInstance = gapi.auth2.getAuthInstance();
            }
        });
        this.initializeGoogleSignIn();
    },
    methods: {
        toSwitchPage() {
            this.isLoginVisible = !this.isLoginVisible;
        },
        async login() {
            try {
                await this.$store.dispatch('login', {
                    email: this.loginEmail,
                    password: this.loginPassword,
                });
                // Login successful
                alert('Login successful');
                this.$router.push('/');
            } catch (error) {
                // Login failed
                alert('Login failed: ' + (error.response ? error.response.data.error : error.message));
            }
        },
        async register() {
            if (this.registerPassword !== this.registerConfirmPassword) {
                alert("Passwords don't match!");
                return;
            }
            try {
                await AuthService.register({
                    email: this.registerEmail,
                    password: this.registerPassword,
                });
                alert('Registration successful. Please log in.');
                this.$router.push('/login');
                this.toSwitchPage();
            } catch (error) {
                alert('Registration failed: ' + (error.response ? error.response.data.error : error.message));
            }
        },
        initializeGoogleSignIn() {
            // Ensure the Google Identity Services script is loaded
            this.loadGoogleApi().then(() => {
                // Initialize Google Identity Services
                google.accounts.id.initialize({
                    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID, // Replace with your actual client ID
                    callback: this.handleCredentialResponse
                });
                // Render the Google Sign-In button
                google.accounts.id.renderButton(
                    document.getElementById('google-signin-btn'),
                    { theme: 'outline', size: 'large' } // Customize as needed
                );
            });
        },
        // 在你的 LoginPage.vue 的 methods 中
        async handleCredentialResponse(response) {
            try {
                const googleUserToken = response.credential;
                const backendResponse = await axios.post("/api/auth/google", {
                    token: googleUserToken,
                });

                if (backendResponse.data && backendResponse.data.token) {
                    this.$store.commit("setUser", backendResponse.data);
                    alert('Login successful');
                    this.$router.push('/');
                } else {
                    console.error("Failed to authenticate with Google: No token returned from backend");
                    // 這裡可以顯示一個錯誤信息給使用者
                }
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                // 這裡可以顯示一個錯誤信息給使用者
            }
        },


        ///////////
        async googleSignIn() {
            const GoogleAuth = gapi.auth2.getAuthInstance();
            if (!GoogleAuth) {
                console.error('Google Auth instance is not available.');
                return;
            }

            try {
                const GoogleUser = await GoogleAuth.signIn();
                const id_token = GoogleUser.getAuthResponse().id_token;
                // Proceed with sending the token to your backend
                this.sendTokenToBackend(id_token);
            } catch (error) {
                console.error('Google Sign-In error:', error);
                // Handle the error appropriately
            }
        },
        async sendTokenToBackend(token) {
            try {
                // Replace '/api/auth/google' with the actual endpoint on your backend
                const response = await axios.post('/api/auth/google', { token });
                // Handle response from backend. E.g., store user info, redirect, etc.
                console.log('Backend response:', response.data);
                // Redirect user or show success message
                // alert('Login successful');
                // this.$router.push('/');
            } catch (error) {
                console.error('Error sending token to backend:', error);
                // Handle error, e.g., show error message to user
            }
        },
        loadGoogleApi() {
            return new Promise((resolve) => {
                // 檢查 gapi 是否已經加載
                if (typeof gapi !== 'undefined') {
                    // 確保 auth2 模塊也已經加載
                    if (!gapi.auth2) {
                        gapi.load('auth2', resolve);
                    } else {
                        resolve();
                    }
                } else {
                    const script = document.createElement('script');
                    script.src = 'https://apis.google.com/js/platform.js';
                    script.onload = () => {
                        gapi.load('auth2', resolve);
                    };
                    document.body.appendChild(script);
                }
            });
        },



    },

};
</script>