<template>
    <div class="flex flex-col min-h-screen bg-black prevent-selection">
        <LoadingHandler>
            <!-- Navbar -->
            <NavbarComponent />

            <!-- Main content that takes remaining space -->
            <main class="flex-1 min-h-screen">
                <RouterView v-if="initialized" />
            </main>

            <!-- Footer stays at bottom -->
            <FooterComponent />
        </LoadingHandler>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import NavbarComponent from './components/navigation/navbar/NavbarComponent.vue'
import FooterComponent from './components/navigation/FooterComponent.vue'
import LoadingHandler from './components/loading/LoadingHandler.vue'

const initialized = ref(false)
const authStore = useAuthStore()

onMounted(async () => {
    await authStore.initializeAuth()
    initialized.value = true
})
</script>
