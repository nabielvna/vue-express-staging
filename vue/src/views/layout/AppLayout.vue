<template>
    <div class="flex flex-col min-h-screen bg-black prevent-selection">
        <!-- Navbar -->
        <NavbarComponent />

        <!-- Main content that takes remaining space -->
        <main class="flex-1 min-h-screen">
            <RouterView />
        </main>

        <!-- Footer stays at bottom -->
        <FooterComponent />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavbarComponent from '@/components/navigation/navbar/NavbarComponent.vue'
import FooterComponent from '@/components/navigation/FooterComponent.vue'
</script>
