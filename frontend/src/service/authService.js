import axios from "axios";

const API_URL = "http://localhost:3000/"; // Adjust this to your backend URL

class AuthService {
  async login(user) {
    const response = await axios.post(API_URL + "login", user);
    // 确保响应中有 token 和 userId
    if (response.data && response.data.token) {
      // 可以选择将 token 和 userId 存储在 localStorage，也可以只存储 token
      localStorage.setItem("user", JSON.stringify(response.data)); // 保存 token 和 userId 到 localStorage
      return response.data; // 返回整个响应对象给调用方
    } else {
      throw new Error("登录失败，未获取到 token。");
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(user) {
    return axios.post(API_URL + "register", user);
  }
}

export default new AuthService();
