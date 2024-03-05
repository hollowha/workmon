<template>
    <div>
        <NavBar />
        <main class="container mx-auto">
            <h2 class="text-2xl font-bold my-4">Our Products</h2>
            <FormInput type="search" id="product-search" placeholder="Search products..." v-model="searchQuery"
                aria-label="Search Products" />
            <!-- Image Carousel -->
            <div class="carousel-container">
                <div v-for="(image, index) in visibleImages" :key="`image-${index}`" class="carousel-image"
                    :style="{ opacity: currentOpacity }">
                    <a :href="image.link" target="_blank">
                        <img :src="image.src" alt="Featured Product" />
                    </a>
                </div>
            </div>
            <!-- <div class="navigation-buttons">
                <button class="prev-button" @click="prevImage">Prev</button>
                <button class="next-button" @click="nextImage">Next</button>
            </div> -->
            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
                <Card v-for="(product, index) in filteredProducts" :key="index" :title="product.name"
                    :image="product.imageUrl" :content="`$${product.price}`">
                    <template #footer>
                        <button @click="addToCart(product)">Add to Cart</button>
                    </template>
                </Card>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';
import FormInput from '@/components/FormInput.vue';
import Card from '@/components/BaseCard.vue';
import axios from 'axios';




export default {
    components: {
        NavBar,
        Footer,
        FormInput,
        Card,
    },
    data() {
        return {
            searchQuery: '',
            products: [],
            images: [
                { src: require('@/assets/home.jpg'), link: 'http://localhost:8080/' },
                { src: require('@/assets/palworld.jpeg'), link: 'https://www.pocketpair.jp/palworld' },
                { src: require('@/assets/pokemon.jpg'), link: 'https://www.pokemon.co.jp/ex/legends_arceus/tc/' },
            ],
            currentIndex: 0,
            intervalId: null,
            currentOpacity: 1,
        };
    },
    computed: {
        visibleImages() {
            return [this.images[this.currentIndex]];
        },
        filteredProducts() {
            return this.products.filter(product => product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        },
    },
    methods: {
        async changeImageAutomatically() {
            // 淡出效果
            const fadeOut = () => new Promise(resolve => {
                let fadeOutInterval = setInterval(() => {
                    if (this.currentOpacity > 0) {
                        this.currentOpacity -= 0.05;
                    } else {
                        clearInterval(fadeOutInterval);
                        resolve();
                    }
                }, 25);
            });

            // 淡入效果
            const fadeIn = () => new Promise(resolve => {
                let fadeInInterval = setInterval(() => {
                    if (this.currentOpacity < 1) {
                        this.currentOpacity += 0.05;
                    } else {
                        clearInterval(fadeInInterval);
                        resolve();
                    }
                }, 25);
            });

            await fadeOut(); // 等待淡出完成
            this.nextImage(); // 切换到下一张图片
            await fadeIn(); // 等待淡入完成
        },
        startCarousel() {
            this.intervalId = setInterval(this.changeImageAutomatically, 4500 + 1000); // 每4.5秒加上淡入淡出所需时间切换一次图片
        },
        nextImage() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
        },
        prevImage() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        },
        // async fetchProducts() {
        //     try {
        //         const response = await axios.get('/products');
        //         this.products = response.data; // Assign the fetched products to the data property
        //     } catch (error) {
        //         console.error('There was an error fetching the products:', error);
        //     }
        // },
        async fetchProducts() {
            try {
                const response = await axios.get('/products');
                this.products = response.data.map((product, index) => {
                    // 假设产品的 ID 或顺序能直接对应到图片文件的编号
                    let imageName = `Gemini_Generated_Image${index > 0 ? ` (${index})` : ''}.jfif`;
                    product.imageUrl = require(`@/assets/products/${imageName}`);
                    return product;
                });
            } catch (error) {
                console.error('There was an error fetching the products:', error);
            }
        },
        async addToCart(productToAdd) {
            const userStr = localStorage.getItem('user'); // Ensure this key matches how you store the user data
            if (!userStr) {
                alert('Not logged in or token expired');
                this.$router.push('/login');
                return;
            }

            const user = JSON.parse(userStr);
            const token = user.token; // Assuming the token is stored under the 'token' property

            try {
                await axios.post('/api/cart/items', {
                    productId: productToAdd.id,
                    quantity: 1,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                alert(`Added ${productToAdd.name} to cart!`);
                this.$store.dispatch('fetchCartItems');
                this.$router.push('/cart');
                this.$router.push('/');//這樣預覽列購物車才會更新，不要問我為甚麼😜
            } catch (error) {
                console.error('Error adding item to cart:', error.response ? error.response.data : error);
                alert('Failed to add item to cart. Please try again.');
            }
        },
    },
    mounted() {
        this.fetchProducts();
        // this.intervalId = setInterval(this.nextImage, 4000); // Change image every 4 seconds
        this.startCarousel();
    },

};
</script>

<style scoped>
/* Update your CSS accordingly */
.main-container {
    max-width: 1200px;
    margin: 0 auto;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin: 16px 0;
}

.carousel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /* Prevents overflow of images outside the container */
}

.carousel-image {
    text-align: center;
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    /* 圆角效果 */
    overflow: hidden;
    /* 确保图片的圆角效果 */
}

.carousel-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.3s;
    border-radius: 15px;
    /* 平滑透明度过渡 */
}


.carousel-container:hover .carousel-image img {
    opacity: 1;
    /* 鼠标悬停时透明度 */
}

/* 设置默认透明度为0.8 */
.carousel-image {
    opacity: 1;
}




.navigation-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.prev-button,
.next-button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.prev-button:hover,
.next-button:hover {
    background-color: #0056b3;
}

/* Your existing .slide-* classes */


/* Fade transitions */
/* Transition classes for fading */
</style>
