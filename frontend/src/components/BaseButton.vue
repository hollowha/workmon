<template>
    <button :class="buttonClass" @click="$emit('click', $event)">
        <slot></slot> <!-- Allows for default button text or more complex content -->
    </button>
</template>
  


<script>
export default {
    name: 'BaseButton',
    props: {
        color: {
            type: String,
            default: 'blue', // Default color class
        },
        extraClasses: {
            type: String,
            default: '',
        },
    },
    computed: {
        buttonClass() {
            return `bg-${this.color}-500 hover:bg-${this.color}-700 text-white font-bold py-2 px-4 rounded ${this.extraClasses}`;
        },
    },
};
</script>
