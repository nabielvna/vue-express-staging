<template>
    <aside class="fixed left-0 bottom-0 w-64 bg-black" style="top: 96px">
        <!-- Navigation Menu -->
        <nav class="mt-6 px-3">
            <div class="space-y-1">
                <router-link
                    v-for="item in filteredMenuItems"
                    :key="item.path"
                    :to="item.path"
                    class="flex items-center px-4 py-3 text-zinc-400 rounded-lg transition-all duration-200 hover:bg-zinc-800/50 group"
                    :class="{
                        'bg-purple-500/10 text-purple-400': isCurrentRoute(
                            item.path,
                        ),
                    }"
                >
                    <div
                        class="p-2 rounded-lg transition-colors duration-200"
                        :class="
                            isCurrentRoute(item.path)
                                ? 'text-purple-400'
                                : 'text-zinc-400 group-hover:text-purple-400'
                        "
                    >
                        <svg
                            class="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path :d="item.svgPath" />
                        </svg>
                    </div>
                    <span class="ml-3 font-medium text-sm">{{
                        item.name
                    }}</span>

                    <!-- Active Indicator -->
                    <span
                        v-if="isCurrentRoute(item.path)"
                        class="ml-auto w-1 h-8 bg-purple-500 rounded-full"
                    ></span>
                </router-link>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'
import { menuItems } from './MenuConfig'

const route = useRoute()
const authStore = useAuthStore()

const isSuperAdmin = computed(() => {
    return authStore.user?.user?.Role?.name === 'superadmin'
})

const filteredMenuItems = computed(() => {
    return menuItems.filter(item => {
        // If the item requires superadmin and user is not superadmin, hide it
        if (item.requireSuperAdmin && !isSuperAdmin.value) {
            return false
        }
        return true
    })
})

const isCurrentRoute = path => {
    return route.path === path
}
</script>
