<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" :src="image" :alt="title">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{{ title }}</div>
            <p class="text-gray-700 text-base">{{ content }}</p>
        </div>
        <div class="px-6 pt-4 pb-2">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
  
<script>
export default {
    props: ['title', 'image', 'content'],
};
</script>
  