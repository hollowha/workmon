<template>
    <div class="mb-4">
        <label :for="id" class="block text-gray-700 text-sm font-bold mb-2">
            {{ label }}
        </label>
        <input :id="id" v-model="localValue" :type="type" :placeholder="placeholder"
            @input="$emit('update:modelValue', localValue)"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    </div>
</template>

<script>
export default {
    props: ['label', 'modelValue', 'id', 'type', 'placeholder'],
    emits: ['update:modelValue'],
    data() {
        return {
            localValue: this.modelValue, // Use this local value for the v-model directive
        };
    },
    watch: {
        // When the prop changes, update the local data property
        modelValue(newVal) {
            if (newVal !== this.localValue) {
                this.localValue = newVal;
            }
        }
    }
};
</script>

<!-- <style scoped>
button {
    background-color: #4299e1;
    /* Example: a nice blue */
    color: #fff;
    /* White text for contrast */
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

button:hover {
    background-color: #2b6cb0;
    /* Darker blue on hover */
}
</style> -->
