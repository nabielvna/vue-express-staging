<template>
    <div class="lg:hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-4">
            <div
                class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"
            ></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500 text-center py-4">
            {{ error }}
        </div>

        <template v-else>
            <!-- Hamburger Button -->
            <button
                @click="isOpen = !isOpen"
                class="relative z-50 p-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Toggle mobile menu"
            >
                <div class="w-6 h-6 relative">
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out"
                        :class="isOpen ? 'rotate-45 top-3' : 'top-1'"
                    ></span>
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out top-3"
                        :class="isOpen ? 'opacity-0' : 'opacity-100'"
                    ></span>
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out"
                        :class="isOpen ? '-rotate-45 top-3' : 'top-5'"
                    ></span>
                </div>
            </button>

            <!-- Mobile Menu Overlay -->
            <div
                class="fixed inset-0 bg-opacity-0 backdrop-blur-sm transition-all duration-300 z-10"
                :class="[isOpen ? 'visible bg-opacity-50' : 'invisible']"
                @click.self="isOpen = false"
            >
                <div
                    class="fixed top-0 right-0 w-full h-full max-w-md bg-black/95 shadow-2xl transform transition-transform duration-300 ease-out"
                    :class="[isOpen ? 'translate-x-0' : 'translate-x-full']"
                >
                    <!-- Menu Container -->
                    <div
                        class="h-full overflow-y-auto pt-4 px-6 pb-6 space-y-6"
                    >
                        <div class="w-full flex justify-center">
                            <Logo />
                        </div>
                        <nav class="space-y-6">
                            <div
                                v-for="menu in menus"
                                :key="menu.id"
                                class="relative"
                            >
                                <div class="group">
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <RouterLink
                                            :to="menu.path"
                                            class="text-white text-lg font-medium tracking-wide py-2 transition-colors duration-200"
                                            @click="isOpen = false"
                                        >
                                            {{ menu.label }}
                                        </RouterLink>
                                        <button
                                            v-if="menu.items?.length"
                                            @click="toggleSubmenu(menu.id)"
                                            class="p-2 text-white transition-colors duration-200"
                                        >
                                            <svg
                                                class="w-5 h-5 transform transition-transform duration-200"
                                                :class="{
                                                    'rotate-180':
                                                        activeSubmenu ===
                                                        menu.id,
                                                }"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Submenu -->
                                    <div
                                        v-if="menu.items?.length"
                                        class="overflow-hidden transition-all duration-300 ease-in-out"
                                        :class="[
                                            activeSubmenu === menu.id
                                                ? 'max-h-96'
                                                : 'max-h-0',
                                        ]"
                                    >
                                        <div
                                            class="pl-4 mt-2 space-y-2 border-l border-gray-700"
                                        >
                                            <RouterLink
                                                v-for="item in menu.items"
                                                :key="item.id"
                                                :to="item.path"
                                                class="block text-gray-300 py-2 text-base transition-colors duration-200"
                                                @click="isOpen = false"
                                            >
                                                {{ item.label }}
                                            </RouterLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useMenuData } from '@/composables/useMenuData'
import { Logo } from '.'

// Use menu data composable
const { menuConfig, isLoading, error, refreshMenuData } = useMenuData()

// Reactive state
const isOpen = ref(false)
const activeSubmenu = ref(null)

// Computed
const menus = computed(() => menuConfig.value)

// Methods
const toggleSubmenu = menuId => {
    activeSubmenu.value = activeSubmenu.value === menuId ? null : menuId
}

// Reset mobile menu state on route change
const router = useRouter()
router.afterEach(() => {
    isOpen.value = false
    activeSubmenu.value = null
})

// Method to manually refresh menu data
const handleRefreshMenu = async () => {
    await refreshMenuData()
}

// Expose necessary properties
defineExpose({
    isOpen,
    refreshMenuData: handleRefreshMenu,
})
</script>
