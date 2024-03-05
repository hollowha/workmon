<template>
    <div>
        <NavBar />
        <main class="container">
            <template>
                <!-- 首頁已改成productPage -->
                <!-- 這頁捨棄掉 -->
            </template>
        </main>
        <Footer />
    </div>
</template>
  
<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/AppFooter.vue';

export default {
    components: {
        NavBar,
        Footer,
    },
};
</script>
  