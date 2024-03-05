<template>
    <div>
        <NavBar />
        <main class="container">
            <h2>Shopping Cart</h2>
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <!-- Directly use item.imageUrl which now contains the direct reference to the image -->
                <img :src="item.imageUrl" :alt="`Product ${item.name}`">
                <div class="cart-item-details">
                    <p><strong>{{ item.name }}</strong></p>
                    <p>${{ item.price }}</p>
                    <div>
                        <button @click="decreaseQuantity(item.id)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item.id)">+</button>
                    </div>
                </div>
                <button @click="removeItem(item.id)">Remove</button>
            </div>
            <div class="cart-summary">
                <p class="mb-4"><strong>Total:</strong> ${{ total }}</p>
                <router-link to="/checkout"
                    class="px-4 py-2 rounded bg-f29d7f hover:bg-e8856a transition duration-150 text-white font-bold">Proceed
                    to Checkout</router-link>
            </div>
        </main>
        <Footer />
    </div>
</template>
  
<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';
import axios from 'axios';

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
    components: {
        NavBar,
        Footer,
    },
    data() {
        return {
            cartItems: [],
        };
    },
    methods: {

        fetchCartItems() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                console.error("User is not logged in.");
                this.$router.push('/login');
                return;
            }

            const headers = {
                Authorization: `Bearer ${user.token}`
            };

            axios.get('/api/cart/items', { headers })
                .then(response => {
                    this.cartItems = response.data.map(item => {
                        // Directly assign the corresponding image based on item.id
                        item.imageUrl = this.assignImageToProduct(item);
                        return item;
                    });
                })
                .catch(error => console.error("Failed to fetch cart items:", error));
        },
        assignImageToProduct(item) {
            // Example logic to assign image based on item id or name
            switch (item.productId) {
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

        async increaseQuantity(itemId) {
            try {
                await axios.put(`/api/cart/items/${itemId}/increase`);
                this.fetchCartItems(); // Refresh cart items after update
            } catch (error) {
                console.error('Error increasing item quantity:', error);
            }
        },
        async decreaseQuantity(itemId) {
            try {
                await axios.put(`/api/cart/items/${itemId}/decrease`);
                this.fetchCartItems(); // Refresh cart items after update
            } catch (error) {
                console.error('Error decreasing item quantity:', error);
            }
        },
        async removeItem(itemId) {
            try {
                await axios.delete(`/api/cart/items/${itemId}`);
                this.fetchCartItems(); // Refresh cart items after removal
                this.$store.dispatch('fetchCartItems');
                this.$router.push('/');//這樣預覽列購物車才會更新，不要問我為甚麼😜
                this.$router.push('/cart');
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        },
    },
    mounted() {
        this.fetchCartItems(); // Load cart items when component mounts
    },

    computed: {
        // total() {
        //     return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
        // },
        total() {
            if (!Array.isArray(this.cartItems)) {
                console.error('Expected cartItems to be an array, but got:', typeof this.cartItems);
                return 0; // Return a fallback value
            }
            return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
        },
    },
};
</script>


  
<style scoped>
.cart-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.cart-item img {
    width: 100px;
    height: auto;
    border-radius: 8px;
}

.cart-item-details {
    display: flex;
    flex-direction: column;
}

.remove-item {
    cursor: pointer;
    color: #007BFF;
    border: none;
    background: none;
}
</style>
  