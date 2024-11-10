<template>
    <div class="min-h-screen bg-black">
        <Sidebar />
        <div class="ml-64">
            <Header :title="pageTitle" />
            <main class="p-8">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup>
import { Header, Sidebar } from '@/components/admin'

defineProps({
    pageTitle: {
        type: String,
        required: true,
    },
})
</script>
