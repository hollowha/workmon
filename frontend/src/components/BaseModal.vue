<template>
    <transition name="modal">
        <div class="fixed z-50 inset-0 overflow-auto bg-smoke-800 flex" v-show="visible">
            <div class="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
                <slot></slot>
                <div class="text-right space-x-2 mt-3">
                    <button @click="$emit('close')"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Close</button>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script>
export default {
    props: ['visible'],
    emits: ['close'],
};
</script>
  
<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.5s;
}

.modal-enter,
.modal-leave-to

/* .modal-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.bg-smoke-800 {
    background-color: rgba(0, 0, 0, 0.5);
}</style>
  