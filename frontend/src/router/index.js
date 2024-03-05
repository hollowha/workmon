import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import ProductPage from "@/views/ProductPage.vue";
import CartPage from "@/views/CartPage.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";

const routes = [
  { path: "/", component: ProductPage },
  { path: "/login", component: LoginPage },
  // { path: "/products", component: ProductPage },
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckoutPage },
  { path: "/profile", component: ProfilePage },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
