<template>
    <aside class="fixed left-0 bottom-0 w-64 bg-black" style="top: 96px">
        <!-- Navigation Menu -->
        <nav class="mt-6 px-3">
            <div class="space-y-1">
                <router-link
                    v-for="item in menuItems"
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

        <!-- Bottom Section -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
            <div
                class="flex items-center justify-between text-sm text-zinc-400"
            >
                <span>Version 1.0.0</span>
                <a
                    href="#"
                    class="hover:text-purple-400 transition-colors duration-200"
                    >Docs</a
                >
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { menuItems } from './MenuConfig'

const route = useRoute()

const isCurrentRoute = path => {
    return route.path === path
}
</script>
