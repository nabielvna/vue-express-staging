<template>
    <button
        @click="$emit('click')"
        class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
    >
        <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M12 4v16m8-8H4"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <span>Add Product</span>
    </button>
</template>

<script setup>
defineEmits(['click'])
</script>
