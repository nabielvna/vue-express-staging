<template>
    <div class="relative">
        <!-- Guest View -->
        <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/signin"
            class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 p-3 hidden lg:block"
        >
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        </RouterLink>

        <!-- Authenticated User View -->
        <div v-else>
            <!-- Profile Button -->
            <button
                @click="toggleDropdown"
                @blur="closeDropdown"
                class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 p-3 focus:outline-none"
                type="button"
            >
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
                v-show="isOpen"
                class="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg z-50"
            >
                <div class="px-4 py-2 border-b border-gray-700">
                    <p class="text-sm text-white">
                        {{ authStore.user?.user?.name }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ authStore.user?.user?.email }}
                    </p>
                </div>

                <RouterLink
                    to="/account/profile"
                    class="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 flex items-center"
                    @click="closeDropdown"
                >
                    <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    Profile
                </RouterLink>

                <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10 flex items-center"
                >
                    <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const isOpen = ref(false)

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const closeDropdown = () => {
    setTimeout(() => {
        isOpen.value = false
    }, 200)
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        closeDropdown()
    } catch (error) {
        console.error('Logout failed:', error)
    }
}
</script>
