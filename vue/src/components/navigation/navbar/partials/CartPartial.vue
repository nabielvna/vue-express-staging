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
                v-show="cartItems.length"
                class="absolute top-0 right-0 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-black"
            >
                {{ totalItems }}
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
                                Shopping Cart ({{ totalItems }})
                            </h2>
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

                    <div class="h-[calc(100%-64px)] flex flex-col">
                        <!-- Loading State -->
                        <div
                            v-if="loading"
                            class="flex-1 flex items-center justify-center"
                        >
                            <div
                                class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
                            ></div>
                        </div>

                        <!-- Error State -->
                        <div
                            v-else-if="error"
                            class="flex-1 flex flex-col items-center justify-center p-8"
                        >
                            <p class="text-red-400 text-center mb-4">
                                {{ error }}
                            </p>
                            <button
                                @click="fetchCart"
                                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                        </div>

                        <!-- Cart Items -->
                        <template v-else-if="cartItems.length > 0">
                            <div
                                class="flex-1 overflow-y-auto p-6 space-y-4 overflow-x-hidden"
                            >
                                <div
                                    v-for="item in cartItems"
                                    :key="item.id"
                                    class="flex gap-4 py-4 border-b border-white/10"
                                >
                                    <!-- Product Image -->
                                    <div
                                        class="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0"
                                    >
                                        <img
                                            :src="
                                                getImageUrl(
                                                    item.ProductSize?.Product
                                                        ?.ProductAssets?.[0]
                                                        ?.asset_url,
                                                )
                                            "
                                            :alt="
                                                item.ProductSize?.Product?.name
                                            "
                                            class="w-full h-full object-cover"
                                        />
                                    </div>

                                    <!-- Product Details -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex">
                                            <div class="flex-1 min-w-0 pr-3">
                                                <h3
                                                    class="text-sm text-white font-medium leading-5 break-words"
                                                >
                                                    {{
                                                        item.ProductSize.Product
                                                            .name
                                                    }}
                                                </h3>
                                                <p
                                                    class="text-sm text-gray-400 mt-0.5"
                                                >
                                                    Size:
                                                    {{
                                                        item.ProductSize.Size
                                                            .size
                                                    }}
                                                </p>
                                            </div>

                                            <div
                                                class="w-24 text-right flex-shrink-0"
                                            >
                                                <p
                                                    class="text-sm text-white font-medium"
                                                >
                                                    {{
                                                        formatPrice(
                                                            item.ProductSize
                                                                .Product.price,
                                                        )
                                                    }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Quantity Controls -->
                                        <div
                                            class="mt-2 flex justify-between items-center"
                                        >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <button
                                                    @click="
                                                        updateItemQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    "
                                                    :disabled="isUpdating"
                                                    class="text-white/80 hover:text-white p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                                >
                                                    <svg
                                                        class="w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-width="2"
                                                            d="M20 12H4"
                                                        />
                                                    </svg>
                                                </button>
                                                <span
                                                    class="text-white min-w-[20px] text-center"
                                                >
                                                    {{ item.quantity }}
                                                </span>
                                                <button
                                                    @click="
                                                        updateItemQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    "
                                                    :disabled="
                                                        isUpdating ||
                                                        item.quantity >=
                                                            item.ProductSize
                                                                .stock
                                                    "
                                                    class="text-white/80 hover:text-white p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                                >
                                                    <svg
                                                        class="w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-width="2"
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                @click="removeFromCart(item.id)"
                                                :disabled="isUpdating"
                                                class="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Empty State -->
                        <template v-else>
                            <div
                                class="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
                            >
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
                                    <p
                                        class="text-gray-400 text-sm max-w-[250px]"
                                    >
                                        Looks like you haven't added any items
                                        to your cart yet
                                    </p>
                                </div>

                                <button
                                    @click="updateCart(false)"
                                    class="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </template>

                        <!-- Footer -->
                        <div class="border-t border-white/10 p-6">
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-400">Subtotal</span>
                                <span class="text-white font-medium">{{
                                    formatPrice(subtotal)
                                }}</span>
                            </div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-400">Shipping</span>
                                <span class="text-white font-medium">Free</span>
                            </div>
                            <div class="flex justify-end mb-6">
                                <router-link
                                    to="/cart"
                                    class="text-gray-400 tracking-[0.1em] hover:text-gray-300 text-sm font-medium transition-colors"
                                    @click="updateCart(false)"
                                >
                                    Cart Details →
                                </router-link>
                            </div>
                            <button
                                @click="proceedToCheckout"
                                class="w-full py-3 rounded-lg transition-colors"
                                :class="[
                                    cartItems.length > 0
                                        ? 'bg-white text-black tracking-[0.2em] hover:bg-white/90'
                                        : 'bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed',
                                ]"
                                :disabled="cartItems.length === 0"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axiosInstance from '@/utils/axios'

const props = defineProps({
    isSearchOpen: Boolean,
    isCartOpen: Boolean,
})

const emit = defineEmits(['updateSearchState', 'updateCartState'])
const router = useRouter()
const authStore = useAuthStore()

// State
const cartItems = ref([])
const loading = ref(false)
const error = ref(null)
const isUpdating = ref(false)

// Computed
const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + Number(item.ProductSize.Product.price) * item.quantity
    }, 0)
})

// Methods
const updateCart = state => {
    if (state === false && props.isSearchOpen) {
        emit('updateSearchState', false)
    }
    emit('updateCartState', state)
}

const formatPrice = price => {
    return `Rp${Number(price).toLocaleString()}`
}

const getImageUrl = url => {
    if (!url) return '/placeholder-image.jpg'
    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${url}`
}

// API Methods
const fetchCart = async () => {
    if (!authStore.isAuthenticated) return

    try {
        loading.value = true
        error.value = null
        const response = await axiosInstance.get('/carts')
        if (response.data.status === 'success') {
            cartItems.value = response.data.data.CartItems || []
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load cart'
        console.error('Error fetching cart:', err)
    } finally {
        loading.value = false
    }
}

const updateItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || isUpdating.value) return

    try {
        isUpdating.value = true
        const response = await axiosInstance.put(`/carts/items/${itemId}`, {
            quantity: newQuantity,
        })

        if (response.data.status === 'success') {
            const index = cartItems.value.findIndex(item => item.id === itemId)
            if (index !== -1) {
                cartItems.value[index] = response.data.data
            }
        }
    } catch (err) {
        const errMsg =
            err.response?.data?.message || 'Failed to update quantity'
        // Show error toast or alert
        console.error('Error updating quantity:', errMsg)
    } finally {
        isUpdating.value = false
    }
}

const removeFromCart = async itemId => {
    if (isUpdating.value) return

    try {
        isUpdating.value = true
        const response = await axiosInstance.delete(`/carts/items/${itemId}`)

        if (response.data.status === 'success') {
            cartItems.value = cartItems.value.filter(item => item.id !== itemId)
            // Optionally show success message
        }
    } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to remove item'
        console.error('Error removing item:', errMsg)
        // Optionally show error message to user
        error.value = errMsg
    } finally {
        isUpdating.value = false
    }
}

const proceedToCheckout = () => {
    if (cartItems.value.length > 0) {
        updateCart(false) // Close cart panel
        router.push('/checkout')
    }
}

// Keyboard shortcuts
const handleKeydown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        emit('updateSearchState', false)
        updateCart(!props.isCartOpen)
    }
}

// Watchers
watch(
    () => props.isCartOpen,
    newValue => {
        if (newValue && authStore.isAuthenticated) {
            fetchCart()
        }
    },
)

watch(
    () => authStore.isAuthenticated,
    newValue => {
        if (newValue) {
            fetchCart()
        } else {
            cartItems.value = []
        }
    },
)

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    if (authStore.isAuthenticated) {
        fetchCart()
    }
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
</style>
