<template>
    <RouterLink
        to="/wishlist"
        class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 p-3 relative"
    >
        <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
        </svg>
        <span
            v-if="wishlistCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
            {{ wishlistCount }}
        </span>
    </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
const wishlistCount = ref(0)
</script>
