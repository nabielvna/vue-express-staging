<template>
    <header
        class="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-10 px-20"
    >
        <div class="flex h-24">
            <!-- Left Section with Logo -->
            <div class="w-68 flex items-center justify-center">
                <img src="/catharsis.png" alt="CATHARSIS" class="h-12 w-auto" />
            </div>

            <!-- Right Section -->
            <div class="flex-1 flex items-center justify-between px-8">
                <h2
                    class="text-2xl font-bold text-white tracking-wider uppercase"
                >
                    {{ title }}
                </h2>

                <div class="flex items-center space-x-6">
                    <!-- Notifications -->
                    <button
                        class="p-2 text-zinc-400 hover:text-purple-400 transition-colors duration-200 relative"
                    >
                        <svg
                            class="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path :d="iconPaths.bell" />
                        </svg>
                        <span
                            class="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-500 rounded-full"
                        ></span>
                    </button>

                    <!-- Settings -->
                    <button
                        class="p-2 text-zinc-400 hover:text-purple-400 transition-colors duration-200"
                    >
                        <svg
                            class="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path :d="iconPaths.settings" />
                        </svg>
                    </button>

                    <!-- User Profile -->
                    <AdminProfile />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { iconPaths } from './MenuConfig'
import AdminProfile from './AdminProfile.vue'

defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>
