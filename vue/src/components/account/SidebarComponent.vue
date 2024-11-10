<template>
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block w-48 flex-shrink-0">
        <nav class="space-y-2 sticky top-8">
            <router-link
                v-for="{ path, label } in menus"
                :key="path"
                :to="withBase(path)"
                class="block px-[11px] py-[7px] text-sm border border-transparent transition-all duration-200 hover:text-white hover:border-zinc-700 hover:border-1"
                :class="{
                    'text-white border-zinc-500 font-medium border-2 px-[10px] py-[6px]':
                        isCurrentPath(path),
                }"
            >
                {{ label }}
            </router-link>
        </nav>
    </div>

    <!-- Mobile Dropdown -->
    <div class="lg:hidden w-full mb-6">
        <div class="relative">
            <!-- Current Selection Button -->
            <button
                @click="isOpen = !isOpen"
                class="w-full flex items-center justify-between px-4 py-2 text-sm text-zinc-400 border border-zinc-700 focus:outline-none"
            >
                <span>{{ getCurrentPageLabel() }}</span>
                <svg
                    class="w-5 h-5 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
                v-if="isOpen"
                class="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 shadow-lg"
            >
                <router-link
                    v-for="{ path, label } in menus"
                    :key="path"
                    :to="withBase(path)"
                    class="block px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
                    :class="{
                        'bg-zinc-800 text-white': isCurrentPath(path),
                    }"
                    @click="isOpen = false"
                >
                    {{ label }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const BASE_URL = '/account'
const route = useRoute()
const isOpen = ref(false)

const menus = [
    { path: '/profile', label: 'Profile' },
    { path: '/address', label: 'Address' },
]

const withBase = path => `${BASE_URL}${path}`
const isCurrentPath = path => route.path === withBase(path)

const getCurrentPageLabel = () => {
    const currentMenu = menus.find(menu => isCurrentPath(menu.path))
    return currentMenu ? currentMenu.label : 'Menu'
}
</script>
