<template>
    <div>
        <NavBar />
        <main class="container">
            <h2>User Profile</h2>
            <section>
                <h3>Profile Details</h3>
                <p><strong>Name:</strong> {{ userProfile.name }}</p>
                <p><strong>Email:</strong> {{ userProfile.email }}</p>
            </section>
            <section>
                <h3>Order History</h3>
                <!-- Example of using Card component for each order -->
                <Card v-for="(order, index) in userProfile.orders" :key="index" :title="`Order #${order.id}`"
                    :content="`$${order.amount} - ${order.date}`">
                </Card>
            </section>
            <section>
                <h3>Update Profile</h3>
                <form @submit.prevent="updateProfile">
                    <FormInput label="Full Name" id="fullname" v-model="userProfile.name" placeholder="Full Name"
                        required />
                    <FormInput label="Email" id="email" type="email" v-model="userProfile.email" placeholder="Email"
                        required />
                    <button type="submit"
                        class="bg-f29d7f hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Update
                        Details</button>
                </form>
            </section>
            <button @click="logout"
                class="bg-fab3a5 hover:bg-e8856a text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in duration-150">Logout</button>
        </main>
        <Footer />
    </div>
</template>

  
<script>
import { useRouter } from 'vue-router'; // Import useRouter to programmatically navigate
import { useStore } from 'vuex'; // Import useStore to access the store instance
import { mapGetters } from 'vuex'; // Import mapGetters helper
import { mapActions } from 'vuex';
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';
import FormInput from '@/components/FormInput.vue';
import Card from '@/components/BaseCard.vue';


export default {
    components: {
        NavBar,
        Footer,
        FormInput,
        Card,
    },
    computed: {
        // Retrieve user's email from either Vuex store or localStorage

        ...mapGetters(['userData']), // Use the userData getter

        userEmail() {
            // Access user's email from Vuex state
            // return this.userData ? this.userData.email : 'No email found';
            console.log('userData', this.userData);
            return this.userData ? 'email found' : 'No email found';
        },
    },
    setup() {
        const router = useRouter();
        const store = useStore();


        const logout = () => {
            store.dispatch('logout');
            router.push('/login');
        };

        return { logout };
    },
    data() {
        return {
            userProfile: {
                name: 'User Name',
                email: 'No email found',
                orders: [
                    // { id: '1', amount: 99.99, date: '2021-01-01' },
                    // Add more orders as needed
                ],
            },
        };
    },
    methods: {
        ...mapActions(['logout']),

        async fetchUserProfile() {
            try {
                const response = await axios.get('/api/user/profile');
                this.userProfile.email = response.data.email;
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // Handle error (e.g., redirect to login if unauthorized)
            }
        },


        updateProfile() {
            // Implement profile update logic here
            alert('Profile updated!');
        },
    },
    mounted() {
        this.fetchUserProfile();
    },
};
</script>

<style scoped>
.bg-f29d7f {
    background-color: #F29D7F;
}

.bg-fab3a5 {
    background-color: #FAB3A5;
}

.hover\:bg-e8856a:hover {
    background-color: #E8856A;
}
</style>