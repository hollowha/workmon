<template>
    <nav class="bg-f29d7f text-white py-1 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
            <!-- Replace this line -->
            <router-link to="/" class="text-xl font-bold hover:text-black">
                <img src="@/assets/logo5.png" alt="Logo" style="height: 70px; width: auto;">
                <!-- Adjust height as needed -->
            </router-link>
            <!-- The rest of your code remains unchanged -->
            <keep-alive>
                <ul class="flex space-x-4">
                    <!-- <li><router-link to="/products" class="hover:text-white">Products</router-link></li> -->
                    <li v-if="!isAuthenticated"><router-link to="/login" class="hover:text-black">Login /
                            Register</router-link></li>
                    <li v-else class="relative flex space-x-4">
                        <router-link to="/profile" class="hover:text-black">Profile</router-link>
                        <div @mouseover="showCartPreview = true" @mouseleave="showCartPreview = false">
                            <router-link to="/cart" class="hover:text-black">Cart</router-link>
                            <div v-if="showCartPreview"
                                class="cart-preview absolute bg-f29d7f bg-opacity-80 mt-1 p-2 rounded shadow-lg max-w-lg overflow-auto text-black">
                                <div v-for="item in cartItems" :key="item.id" class="flex items-center">
                                    <img :src="getImageUrl(item.productId)" alt="Product image"
                                        class="h-16 w-16 object-cover mr-2">
                                    <div>
                                        <span class="text-white">{{ item.name }}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <router-link to="/cart" class="hover:text-black" @click="logout">Log Out</router-link>
                    </li>
                </ul>
            </keep-alive>
        </div>
    </nav>
</template>


<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import image1 from '@/assets/products/Gemini_Generated_Image.jfif';
import image2 from '@/assets/products/Gemini_Generated_Image (1).jfif';
import image3 from '@/assets/products/Gemini_Generated_Image (2).jfif';
import image4 from '@/assets/products/Gemini_Generated_Image (3).jfif';
import image5 from '@/assets/products/Gemini_Generated_Image (4).jfif';
import image6 from '@/assets/products/Gemini_Generated_Image (5).jfif';
import image7 from '@/assets/products/Gemini_Generated_Image (6).jfif';
import image8 from '@/assets/products/Gemini_Generated_Image (7).jfif';
import image9 from '@/assets/products/Gemini_Generated_Image (8).jfif';
import image10 from '@/assets/products/Gemini_Generated_Image (9).jfif';
import image11 from '@/assets/products/Gemini_Generated_Image (10).jfif';
import image12 from '@/assets/products/Gemini_Generated_Image (11).jfif';



export default {
    name: 'NavBar',
    setup() {
        const router = useRouter();
        const store = useStore();
        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        const showCartPreview = ref(false);
        // const cartItems = ref([]); // 临时的空数组，实际应从 Vuex store 获取
        const cartItems = computed(() => store.getters.cartItems);
        // 假设有一个 Vuex action 'fetchCartItems' 用于获取购物车数据
        store.dispatch('fetchCartItems').then(() => {
            // cartItems.value = store.getters.cartItems; // 假设有一个 getter 'cartItems'
        });

        const logout = () => {
            store.dispatch('logout').then(() => {
                router.push('/login');
            });
        };

        return {
            isAuthenticated,
            showCartPreview,
            cartItems,
            logout,
        };
    },
    methods: {
        getImageUrl(productId) {
            // Assign image based on product ID or some unique identifier
            switch (productId) {
                case 25: return image1;
                case 26: return image2;
                case 27: return image3;
                case 28: return image4;
                case 29: return image5;
                case 30: return image6;
                case 31: return image7;
                case 32: return image8;
                case 33: return image9;
                case 34: return image10;
                case 35: return image11;
                case 36: return image12;

                default: return image1; // default image or empty string
            }
        },
    },
};
</script>

<style scoped>
.body {
    font-family: "Anta", sans-serif;
    font-style: normal;
}

.cart-preview {
    background-color: rgba(242, 157, 127, 0.8);
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    /* Set to full width of its parent container */
    max-width: 640px;
    /* Adjust this value to suit your design, making it as wide as needed */
    overflow: visible;
    /* Adjusted to remove scrollbars */
    color: #FFF;
    padding: 1rem;
    box-sizing: border-box;
    /* Ensures padding does not add to the set width */
}



.cart-preview .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
