<template>
    <nav
        class="h-16 lg:h-24 w-full z-50 top-0 left-0 flex items-center prevent-selection"
        :class="[
            route.path === '/' ? 'absolute' : '',
            isMenuHovered || isMobileMenuOpen
                ? 'bg-black'
                : route.path === '/'
                  ? 'bg-transparent'
                  : 'bg-black',
        ]"
    >
        <div class="w-full max-w-7xl mx-auto px-2 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Mobile Menu -->
                <MobileMenu v-model:isOpen="isMobileMenuOpen" />

                <!-- Logo -->
                <RouterLink to="/">
                    <Logo />
                </RouterLink>

                <!-- Desktop Menu Component -->
                <DesktopMenu
                    v-model:menuHovered="isMenuHovered"
                    class="hidden lg:block"
                />

                <!-- Right Section: Search, Wishlist, Cart, Account -->
                <div
                    :class="[
                        'items-center lg:space-x-2',
                        isMobileMenuOpen ? 'hidden' : 'flex',
                    ]"
                >
                    <Search
                        :isSearchOpen="isSearchOpen"
                        :isCartOpen="isCartOpen"
                        @updateCartState="updateCartState"
                        @updateSearchState="updateSearchState"
                    />
                    <Wishlist class="hidden lg:block" />
                    <Cart
                        :isSearchOpen="isSearchOpen"
                        :isCartOpen="isCartOpen"
                        @updateSearchState="updateSearchState"
                        @updateCartState="updateCartState"
                    />
                    <Account class="hidden lg:block" />
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
    Logo,
    Cart,
    Account,
    Wishlist,
    DesktopMenu,
    MobileMenu,
    Search,
} from './partials'

const route = useRoute()

// State management
const isSearchOpen = ref(false)
const isCartOpen = ref(false)
const isMenuHovered = ref(false)
const isMobileMenuOpen = ref(false)

// Methods
const updateCartState = newState => {
    isCartOpen.value = newState
}

const updateSearchState = newState => {
    isSearchOpen.value = newState
}
</script>
