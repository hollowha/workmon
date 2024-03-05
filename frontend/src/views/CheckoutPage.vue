<template>
    <div>
        <NavBar />
        <main class="container">
            <h2>Checkout</h2>
            <form @submit.prevent="submitOrder">
                <h3>Shipping Address</h3>
                <FormInput type="text" id="fullname" v-model="fullname" label="Full Name" required />
                <FormInput type="text" id="address" v-model="address" label="Address" required />
                <FormInput type="text" id="city" v-model="city" label="City" required />
                <FormInput type="text" id="state" v-model="state" label="State" required />
                <FormInput type="text" id="zip" v-model="zip" label="Zip Code" required />

                <h3>Payment Information</h3>
                <FormInput type="text" id="cardname" v-model="cardname" label="Name on Card" required />
                <FormInput type="text" id="cardnumber" v-model="cardnumber" label="Credit Card Number" required />
                <FormInput type="text" id="expmonth" v-model="expmonth" label="Expiry Month" required />
                <FormInput type="text" id="expyear" v-model="expyear" label="Expiry Year" required />
                <FormInput type="text" id="cvv" v-model="cvv" label="CVV" required />

                <BaseButton color="green" type="submit">Complete Purchase</BaseButton>
            </form>
        </main>
        <Footer />
    </div>
</template>
  


  
<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormInput from '@/components/FormInput.vue';



export default {
    components: {
        NavBar,
        Footer,
        BaseButton,
        FormInput,
    },
    data() {
        return {
            fullname: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            cardname: '',
            cardnumber: '',
            expmonth: '',
            expyear: '',
            cvv: '',
        };
    },
    methods: {
        submitOrder() {
            // Implement order submission logic here
            alert('Order submitted!');
        },
    },
};
</script>
  