<template>
    <div>
        <!-- Cart Button -->
        <button
            @click="updateCart(true)"
            class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 relative p-3 transition-colors z-0"
        >
            <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            <span
                v-show="cartCount"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-black"
            >
                {{ cartCount }}
            </span>
        </button>

        <!-- Cart Panel -->
        <Transition
            enter-active-class="duration-100 ease-out"
            leave-active-class="duration-100 ease-in"
        >
            <div
                v-show="isCartOpen"
                class="fixed inset-0 z-50"
                @keydown.esc="updateCart(false)"
            >
                <!-- Backdrop -->
                <div
                    class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                    :class="[isCartOpen ? 'opacity-100' : 'opacity-0']"
                    @click="updateCart(false)"
                ></div>

                <!-- Sidebar -->
                <div
                    class="fixed inset-y-0 right-0 w-full max-w-md bg-black/90 transform transition-transform border-l border-white/10 backdrop-blur-sm"
                    :class="[isCartOpen ? 'translate-x-0' : 'translate-x-full']"
                    @click.stop
                >
                    <!-- Header -->
                    <header
                        class="flex items-center justify-between px-6 py-4 border-b border-white/10"
                    >
                        <div class="flex items-center gap-3">
                            <h2
                                class="text-base text-white uppercase tracking-wide font-medium"
                            >
                                Shopping Cart
                            </h2>
                            <!-- Keyboard Shortcut -->
                            <kbd
                                class="hidden sm:flex px-2 py-1 text-xs text-gray-400 bg-white/5 border border-white/10 rounded items-center gap-1"
                            >
                                <span class="text-xs">⌘</span>
                                <span>M</span>
                            </kbd>
                        </div>
                        <button
                            @click="updateCart(false)"
                            class="text-white/80 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <svg
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                fill="none"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </header>

                    <!-- Empty State Content -->
                    <div class="h-[calc(100%-64px)] flex flex-col">
                        <div
                            class="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
                        >
                            <!-- Empty Cart Illustration -->
                            <div class="relative">
                                <div
                                    class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center"
                                >
                                    <svg
                                        class="w-12 h-12 text-white/40"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        fill="none"
                                    >
                                        <path
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-sm"
                                >
                                    0
                                </div>
                            </div>

                            <div class="text-center space-y-2">
                                <p class="text-white text-lg font-medium">
                                    Your cart is empty
                                </p>
                                <p class="text-gray-400 text-sm max-w-[250px]">
                                    Looks like you haven't added any items to
                                    your cart yet
                                </p>
                            </div>

                            <button
                                @click="updateCart(false)"
                                class="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-white/10 p-6">
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-400">Subtotal</span>
                                <span class="text-white font-medium"
                                    >$0.00</span
                                >
                            </div>
                            <div class="flex justify-between text-sm mb-6">
                                <span class="text-gray-400">Shipping</span>
                                <span class="text-white font-medium">Free</span>
                            </div>
                            <button
                                class="w-full py-3 bg-white/5 text-gray-400 rounded-lg border border-white/10 cursor-not-allowed"
                                disabled
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cartCount = ref(0)

const props = defineProps({
    isSearchOpen: Boolean,
    isCartOpen: Boolean,
})

const emit = defineEmits(['updateSearchState', 'updateCartState'])

const updateCart = state => {
    if (state === false && props.isSearchOpen) {
        emit('updateSearchState', false)
    }
    emit('updateCartState', state)
}

// Keyboard shortcuts
const handleKeydown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        emit('updateSearchState', false)
        updateCart(!props.isCartOpen)
    }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
</style>
