<template>
    <div class="w-48 flex-shrink-0">
        <nav class="space-y-1 sticky top-8">
            <router-link
                v-for="{ path, label } in menus"
                :key="path"
                :to="withBase(path)"
                class="block px-3 py-2 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
                :class="{
                    'text-white bg-gray-800': isCurrentPath(path),
                }"
            >
                {{ label }}
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const BASE_URL = '/account'
const route = useRoute()

const menus = [
    { path: '/profile', label: 'Profile' },
    { path: '/address', label: 'Address' },
]

const withBase = path => `${BASE_URL}${path}`
const isCurrentPath = path => route.path === withBase(path)
</script>
