<template>
    <div class="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <h1 class="text-2xl mb-8 tracking-[0.2em]">YOUR CART</h1>

            <!-- Continue Shopping Link -->
            <div class="mb-8">
                <router-link
                    to="/"
                    class="text-white hover:opacity-80 transition-opacity uppercase text-sm tracking-wider"
                >
                    ← CONTINUE BROWSING
                </router-link>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
                ></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-400 mb-4">{{ error }}</p>
                <button
                    @click="fetchCart"
                    class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>

            <template v-else>
                <!-- Table Headers -->
                <div
                    v-if="cartItems.length > 0"
                    class="grid grid-cols-12 gap-4 py-4 border-b border-white/10 uppercase text-xs tracking-wider"
                >
                    <div class="col-span-6">PRODUCT</div>
                    <div class="col-span-2 text-right">PRICE</div>
                    <div class="col-span-2 text-center">QUANTITY</div>
                    <div class="col-span-2 text-right">TOTAL</div>
                </div>

                <!-- Empty Cart State -->
                <div v-if="cartItems.length === 0" class="text-center py-12">
                    <div class="mb-6">
                        <div
                            class="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center"
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
                    </div>
                    <h2 class="text-xl font-medium mb-2">Your cart is empty</h2>
                    <p class="text-gray-400 mb-6">
                        Looks like you haven't added any items to your cart yet
                    </p>
                    <router-link
                        to="/"
                        class="inline-block px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Continue Shopping
                    </router-link>
                </div>

                <!-- Cart Items -->
                <div v-else class="divide-y divide-white/10">
                    <div
                        v-for="item in cartItems"
                        :key="item.id"
                        class="py-6 grid grid-cols-12 gap-4 items-center"
                    >
                        <!-- Product Info -->
                        <div class="col-span-6 flex gap-6">
                            <div class="w-32 h-32 bg-gray-900">
                                <img
                                    :src="
                                        getImageUrl(
                                            item.ProductSize?.Product
                                                ?.ProductAssets?.[0]?.asset_url,
                                        )
                                    "
                                    :alt="item.ProductSize?.Product?.name"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="flex flex-col justify-between py-1">
                                <div>
                                    <h3 class="font-light text-lg">
                                        {{ item.ProductSize.Product.name }}
                                    </h3>
                                    <p class="text-sm text-gray-400 mt-1">
                                        Size: {{ item.ProductSize.Size.size }}
                                    </p>
                                </div>
                                <button
                                    @click="removeFromCart(item.id)"
                                    :disabled="isUpdating"
                                    class="text-white/60 hover:text-white uppercase text-left tracking-wider disabled:opacity-50"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="col-span-2 text-right">
                            {{ formatPrice(item.ProductSize.Product.price) }}
                        </div>

                        <!-- Quantity -->
                        <div class="col-span-2">
                            <div class="flex items-center justify-center">
                                <div
                                    class="border border-white/20 rounded flex items-center"
                                >
                                    <button
                                        @click="
                                            updateItemQuantity(
                                                item.id,
                                                item.quantity - 1,
                                            )
                                        "
                                        :disabled="isUpdating"
                                        class="px-3 py-1 hover:bg-white/5 disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span
                                        class="px-3 py-1 min-w-[40px] text-center"
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
                                                item.ProductSize.stock
                                        "
                                        class="px-3 py-1 hover:bg-white/5 disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="col-span-2 text-right font-light">
                            {{
                                formatPrice(
                                    item.ProductSize.Product.price *
                                        item.quantity,
                                )
                            }}
                        </div>
                    </div>
                </div>

                <!-- Subtotal Section -->
                <div v-if="cartItems.length > 0" class="mt-8 text-right">
                    <div class="inline-flex flex-col items-end">
                        <div class="flex justify-between gap-8">
                            <span class="uppercase text-sm tracking-wider"
                                >SUBTOTAL</span
                            >
                            <span class="font-light">{{
                                formatPrice(subtotal)
                            }}</span>
                        </div>
                        <p class="text-white/60 text-sm mt-2 italic">
                            Shipping & taxes calculated at checkout
                        </p>
                    </div>
                </div>

                <!-- Checkout Action -->
                <div v-if="cartItems.length > 0" class="mt-8">
                    <button
                        @click="navigateToCheckout"
                        :disabled="isUpdating"
                        class="w-full bg-white text-black py-4 uppercase tracking-wider text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                        Check Out
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axiosInstance from '@/utils/axios'

const router = useRouter()
const authStore = useAuthStore()

// State
const cartItems = ref([])
const loading = ref(false)
const error = ref(null)
const isUpdating = ref(false)

// Computed
const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + Number(item.ProductSize.Product.price) * item.quantity
    }, 0)
})

// Methods
const formatPrice = price => {
    return `Rp${Number(price).toLocaleString()}`
}

const getImageUrl = url => {
    if (!url) return '/placeholder-image.jpg'
    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${url}`
}

const fetchCart = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/signin')
        return
    }

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
        error.value = errMsg
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
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to remove item'
        console.error('Error removing item:', err)
    } finally {
        isUpdating.value = false
    }
}

const navigateToCheckout = () => {
    if (cartItems.value.length > 0) {
        router.push('/checkout')
    }
}

// Lifecycle hooks
onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchCart()
    } else {
        router.push('/signin')
    }
})
</script>
