<template>
    <div class="w-full min-h-screen bg-black">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <!-- Main Content with Flexbox -->
            <div class="flex flex-col md:flex-row gap-6">
                <!-- Sidebar Component -->
                <SidebarComponent />

                <!-- Main Content Area -->
                <div class="flex-1 min-w-0">
                    <div class="border-zinc-500 border-2 p-6">
                        <RouterView />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SidebarComponent from '@/components/account/SidebarComponent.vue'
import { RouterView } from 'vue-router'
</script>
