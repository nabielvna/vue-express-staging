<template>
    <div class="max-w-[1440px] mx-auto px-4 py-12">
        <!-- Back Button & Title -->
        <div class="flex items-center gap-4 mb-8">
            <button
                @click="router.back()"
                class="p-2 text-zinc-400 hover:text-white transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </button>
            <h1 class="text-3xl font-bold text-white uppercase tracking-wider">
                Detail Transaksi
            </h1>
        </div>

        <!-- Loading State -->
        <div
            v-if="loading"
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-zinc-400 text-lg">Loading...</p>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-red-400 text-lg">{{ error }}</p>
        </div>

        <!-- Order Details -->
        <div v-else-if="order" class="space-y-8">
            <!-- Order Summary -->
            <div class="bg-[#131313] border border-zinc-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-white mb-6">
                    Informasi Order
                </h2>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <div>
                        <p
                            class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                        >
                            Order ID
                        </p>
                        <p class="text-white font-medium">{{ order.id }}</p>
                    </div>
                    <div>
                        <p
                            class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                        >
                            Tanggal Order
                        </p>
                        <p class="text-white">
                            {{ formatDate(order.created_at) }}
                        </p>
                    </div>
                    <div>
                        <p
                            class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                        >
                            Status
                        </p>
                        <span
                            class="px-3 py-1 text-sm uppercase tracking-wider font-medium inline-block"
                            :class="getStatusClass(order.OrderStatus?.name)"
                        >
                            {{ order.OrderStatus?.name }}
                        </span>
                    </div>
                    <div>
                        <p
                            class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                        >
                            Total Order
                        </p>
                        <p class="text-white font-medium">
                            {{ formatPrice(order.total_price) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Shipping Address -->
            <div
                v-if="order.Address"
                class="bg-[#131313] border border-zinc-800 rounded-lg p-6"
            >
                <h2 class="text-xl font-bold text-white mb-6">
                    Alamat Pengiriman
                </h2>
                <div class="space-y-2">
                    <p class="text-white font-medium">
                        {{ order.Address.name }}
                    </p>
                    <p class="text-zinc-400">
                        {{ order.Address.street_address }}
                    </p>
                    <p class="text-zinc-400">
                        {{ order.Address.subdistrict }},
                        {{ order.Address.city }}, {{ order.Address.province }}
                        {{ order.Address.postal_code }}
                    </p>
                </div>
            </div>

            <!-- Order Items -->
            <div class="bg-[#131313] border border-zinc-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-white mb-6">Detail Produk</h2>
                <div class="divide-y divide-zinc-800">
                    <div
                        v-for="item in order.OrderItems"
                        :key="item.id"
                        class="py-4 first:pt-0 last:pb-0"
                    >
                        <div class="flex gap-4">
                            <div
                                class="w-24 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800"
                            >
                                <img
                                    v-if="getProductImage(item)"
                                    :src="getProductImage(item)"
                                    :alt="getProductName(item)"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="flex-grow">
                                <h4 class="text-white font-medium">
                                    {{ getProductName(item) }}
                                </h4>
                                <p class="text-zinc-400">
                                    Size: {{ getProductSize(item) }}
                                </p>
                                <p class="text-zinc-400">
                                    Quantity: {{ item.quantity }}
                                </p>
                                <p class="text-white font-medium mt-2">
                                    {{
                                        formatPrice(
                                            item.ProductSize?.Product?.price *
                                                item.quantity,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Price Details -->
            <div class="bg-[#131313] border border-zinc-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-white mb-6">
                    Rincian Pembayaran
                </h2>
                <div class="space-y-4">
                    <div v-for="(item, index) in order.OrderItems" :key="index">
                        <div class="flex justify-between text-zinc-400">
                            <span
                                >{{ getProductName(item) }} ({{
                                    item.quantity
                                }}x)</span
                            >
                            <span>{{
                                formatPrice(
                                    item.ProductSize?.Product?.price *
                                        item.quantity,
                                )
                            }}</span>
                        </div>
                    </div>
                    <div class="border-t border-zinc-800 pt-4 mt-4">
                        <div
                            class="flex justify-between text-white font-medium"
                        >
                            <span>Total</span>
                            <span>{{ formatPrice(order.total_price) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Not Found State -->
        <div
            v-else
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-zinc-400 text-lg">Order tidak ditemukan</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axiosInstance from '@/utils/axios'

const router = useRouter()
const route = useRoute()
const order = ref(null)
const loading = ref(false)
const error = ref(null)

// Helper functions
const getProductImage = item => {
    if (!item?.ProductSize?.Product?.ProductAssets?.length)
        return '/placeholder-image.jpg'

    const assetUrl = item.ProductSize.Product.ProductAssets[0]?.asset_url
    if (!assetUrl) return '/placeholder-image.jpg'

    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${assetUrl}`
}

const getProductName = item => {
    return item?.ProductSize?.Product?.name || 'Product Name Not Available'
}

const getProductSize = item => {
    return item?.ProductSize?.Size?.size || 'Size Not Available'
}

const getStatusClass = status => {
    if (!status) return 'border border-zinc-500 text-zinc-500'

    const statusClasses = {
        Pending: 'border border-yellow-500 text-yellow-500',
        Processing: 'border border-blue-500 text-blue-500',
        Shipped: 'border border-purple-500 text-purple-500',
        Delivered: 'border border-green-500 text-green-500',
        Cancelled: 'border border-red-500 text-red-500',
    }
    return statusClasses[status] || 'border border-zinc-500 text-zinc-500'
}

const formatPrice = price => {
    if (!price) return 'Rp0'
    return `Rp${Number(price).toLocaleString('id-ID')}`
}

const formatDate = dateString => {
    if (!dateString) return ''
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch (err) {
        console.error('Error formatting date:', err)
        return ''
    }
}

// Fetch order details
const fetchOrderDetails = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await axiosInstance.get(
            `/orders/my-orders/${route.params.id}`,
        )

        if (response?.data?.status === 'success') {
            order.value = response.data.data
        } else {
            throw new Error(
                response?.data?.message || 'Failed to fetch order details',
            )
        }
    } catch (err) {
        console.error('Error fetching order details:', err)
        error.value =
            err?.response?.data?.message || 'Failed to load order details'
        order.value = null
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(() => {
    fetchOrderDetails()
})
</script>
