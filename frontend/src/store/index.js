import { createStore } from "vuex";
import AuthService from "@/service/authService";
import axios from "axios";

const store = createStore({
  state() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      cartItems: [], // Initialize as an empty array
    };
  },
  mutations: {
    // Mutation 用于更新用户状态
    setUser(state, user) {
      state.user = user;
      if (user) {
        console.log("Storing user in localStorage:", user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
    setCartItems(state, items) {
      state.cartItems = items;
    },
  },
  actions: {
    async login({ commit }, userCredentials) {
      try {
        const data = await AuthService.login(userCredentials);
        commit("setUser", data); // 使用返回的数据（包含 token 和 userId）更新 Vuex state
        return Promise.resolve(data);
      } catch (error) {
        commit("setUser", null); // 登录失败时清除用户状态
        return Promise.reject(error);
      }
    },
    logout({ commit }) {
      AuthService.logout(); // 可能需要在 AuthService 中处理登出逻辑
      commit("setUser", null);
    },
    async googleSignIn({ commit }, googleResponse) {
      try {
        // Extracting the Google ID token from the Google Sign-In response
        const googleUserToken = googleResponse.credential;

        // Send the Google ID token to your backend for verification
        const response = await axios.post("/api/auth/google", {
          token: googleUserToken,
        });

        // Check if the backend response includes the necessary user data and a token
        if (response.data && response.data.token) {
          // Update Vuex state with the user data returned from your backend
          commit("setUser", response.data); // Assuming response.data contains the user data and your own token
          return Promise.resolve(response.data);
        } else {
          // Handle the case where the backend response does not include a token
          console.error(
            "Failed to authenticate with Google: No token returned from backend"
          );
          commit("setUser", null); // Optionally clear user state
          return Promise.reject(
            new Error("Failed to authenticate with Google")
          );
        }
      } catch (error) {
        console.error("Error during Google sign-in:", error);
        commit("setUser", null); // Clear user state in case of error

        // Extract and forward a more specific error message if available
        const errorMessage =
          error.response?.data?.error || error.message || "Unknown error";
        return Promise.reject(new Error(errorMessage));
      }
    },
    fetchCartItems({ commit }) {
      axios
        .get("/api/cart/items", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 假设您的 token 存储在 localStorage
          },
        })
        .then((response) => {
          commit("setCartItems", response.data);
        })
        .catch((error) => console.error("Failed to fetch cart items:", error));
    },
    // ...其他 actions
  },
  getters: {
    isAuthenticated(state) {
      console.log(!!state.user);
      return !!state.user && !!state.user.token; // 检查 state.user 是否存在且包含 token
    },
    // Add this getter
    userData(state) {
      return state.user;
    },
    cartItems: (state) => state.cartItems,
  },
});

export default store;
