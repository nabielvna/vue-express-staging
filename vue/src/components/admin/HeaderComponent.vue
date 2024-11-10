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
                    <!-- User Profile -->
                    <AdminProfile />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
// import { iconPaths } from './MenuConfig'
import AdminProfile from './AdminProfile.vue'

defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>
