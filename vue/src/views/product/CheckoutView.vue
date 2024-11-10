<template>
    <div class="min-h-screen bg-black">
        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <!-- Left Column - Forms -->
                <div class="space-y-6">
                    <!-- Navigation -->
                    <nav>
                        <ol class="flex items-center text-sm space-x-2">
                            <li
                                class="text-white/60 hover:text-white cursor-pointer"
                                @click="$router.push('/cart')"
                            >
                                Cart
                            </li>
                            <li class="text-white/60">></li>
                            <li class="text-white">Information</li>
                            <li class="text-white/60">></li>
                            <li class="text-white/60">Payment</li>
                        </ol>
                    </nav>

                    <!-- Account Section -->
                    <div class="border border-white/10 rounded p-4">
                        <h2 class="text-sm text-white/60 mb-4">Account</h2>
                        <input
                            type="email"
                            v-model="formData.email"
                            :placeholder="user?.email || 'Email'"
                            disabled
                            class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                        />
                    </div>

                    <!-- Shipping Section with modified delivery options -->
                    <div class="border border-white/10 rounded p-4">
                        <h2 class="text-sm text-white/60 mb-4">Delivery</h2>
                        <!-- Profile Data Option -->
                        <button
                            class="w-full mb-4"
                            @click="setDeliveryOption('profile')"
                        >
                            <div
                                class="w-full flex items-center justify-between bg-black border border-white/10 rounded px-4 py-3 text-white hover:border-white/20"
                                :class="{
                                    'border-white/30':
                                        deliveryOption === 'profile',
                                }"
                            >
                                <div class="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        :checked="deliveryOption === 'profile'"
                                        class="text-white"
                                    />
                                    <span>Use Saved Address</span>
                                </div>
                                <div class="flex items-center">
                                    <svg
                                        class="w-5 h-5 text-white/60"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        fill="none"
                                    >
                                        <path
                                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        <!-- Manual Fill Option -->
                        <button
                            class="w-full"
                            @click="setDeliveryOption('manual')"
                        >
                            <div
                                class="w-full flex items-center justify-between bg-black border border-white/10 rounded px-4 py-3 text-white hover:border-white/20"
                                :class="{
                                    'border-white/30':
                                        deliveryOption === 'manual',
                                }"
                            >
                                <div class="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        :checked="deliveryOption === 'manual'"
                                        class="text-white"
                                    />
                                    <span>New Address</span>
                                </div>
                                <div class="flex items-center">
                                    <svg
                                        class="w-5 h-5 text-white/60"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        fill="none"
                                    >
                                        <path
                                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        <!-- Profile Addresses Selection -->
                        <div
                            v-if="
                                deliveryOption === 'profile' &&
                                savedAddresses.length > 0
                            "
                            class="mt-4 space-y-4"
                        >
                            <div
                                v-for="address in savedAddresses"
                                :key="address.id"
                            >
                                <button
                                    class="w-full text-left"
                                    @click="selectAddress(address)"
                                >
                                    <div
                                        class="p-4 border rounded hover:border-white/20 transition-colors"
                                        :class="
                                            selectedAddress?.id === address.id
                                                ? 'border-white/30 bg-white/5'
                                                : 'border-white/10'
                                        "
                                    >
                                        <div
                                            class="flex items-center space-x-3"
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                :checked="
                                                    selectedAddress?.id ===
                                                    address.id
                                                "
                                                class="text-white"
                                            />
                                            <div class="flex-1">
                                                <p
                                                    class="text-white font-medium"
                                                >
                                                    {{ address.name }}
                                                </p>
                                                <p
                                                    class="text-white/60 text-sm mt-1"
                                                >
                                                    {{ address.street_address }}
                                                </p>
                                                <p
                                                    class="text-white/60 text-sm"
                                                >
                                                    {{ address.subdistrict }},
                                                    {{ address.city }},
                                                    {{ address.district }}
                                                    {{ address.id }}
                                                </p>
                                                <p
                                                    class="text-white/60 text-sm"
                                                >
                                                    {{ address.province }},
                                                    {{ address.postal_code }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Manual Address Form -->
                        <div
                            v-if="deliveryOption === 'manual'"
                            class="space-y-4 mt-4"
                        >
                            <!-- Country Selection -->
                            <select
                                v-model="formData.country"
                                class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white"
                            >
                                <option value="ID">Indonesia</option>
                            </select>

                            <!-- Name -->
                            <input
                                type="text"
                                v-model="formData.name"
                                placeholder="Address Name (e.g. Home, Office)"
                                class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                            />

                            <!-- Street Address -->
                            <input
                                type="text"
                                v-model="formData.street_address"
                                placeholder="Street Address"
                                class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                            />

                            <!-- Subdistrict, City, District Grid -->
                            <div class="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    v-model="formData.subdistrict"
                                    placeholder="Subdistrict"
                                    class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                                />
                                <input
                                    type="text"
                                    v-model="formData.city"
                                    placeholder="City"
                                    class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                                />
                                <input
                                    type="text"
                                    v-model="formData.district"
                                    placeholder="District"
                                    class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                                />
                            </div>

                            <!-- Province and Postal Code -->
                            <div class="grid grid-cols-2 gap-4">
                                <select
                                    v-model="formData.province"
                                    class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white"
                                >
                                    <option value="">Province</option>
                                    <option
                                        v-for="province in provinces"
                                        :key="province.value"
                                        :value="province.value"
                                    >
                                        {{ province.label }}
                                    </option>
                                </select>
                                <input
                                    type="text"
                                    v-model="formData.postal_code"
                                    placeholder="Postal Code"
                                    class="w-full bg-transparent border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/40"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Review Order -->
                    <div class="border border-white/10 rounded p-4">
                        <h2 class="text-sm text-white/60 mb-4">Review Order</h2>
                        <div
                            v-if="deliveryOption === 'manual'"
                            class="flex items-center space-x-2 mb-4"
                        >
                            <input
                                type="checkbox"
                                id="saveAddress"
                                v-model="saveAddress"
                                class="rounded border-white/10"
                            />
                            <label
                                for="saveAddress"
                                class="text-sm text-white/60"
                                >Save this address for future orders</label
                            >
                        </div>
                        <div class="flex justify-between items-center">
                            <router-link
                                to="/cart"
                                class="text-white hover:text-white/80 flex items-center space-x-2"
                            >
                                <svg
                                    class="w-4 h-4"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M10 12L6 8l4-4"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span>Return to cart</span>
                            </router-link>
                            <button
                                @click="placeOrder"
                                :disabled="isSubmitting || !isFormValid"
                                class="bg-white text-black px-6 py-2 rounded hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {{
                                    isSubmitting
                                        ? 'Processing...'
                                        : 'Place Order'
                                }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Order Summary -->
                <div class="lg:sticky lg:top-8 h-fit mt-[46px]">
                    <div class="border border-white/10 rounded p-5">
                        <!-- Cart Items -->
                        <div
                            class="space-y-4 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-1"
                        >
                            <div
                                v-for="item in cartItems"
                                :key="item.id"
                                class="flex gap-4"
                            >
                                <!-- Product Image -->
                                <div
                                    class="relative w-20 h-20 bg-white/5 rounded overflow-hidden"
                                >
                                    <img
                                        :src="
                                            getImageUrl(
                                                item.ProductSize?.Product
                                                    ?.ProductAssets?.[0]
                                                    ?.asset_url,
                                            )
                                        "
                                        :alt="item.ProductSize?.Product?.name"
                                        class="w-full h-full object-cover"
                                    />
                                </div>

                                <!-- Product Details -->
                                <div
                                    class="flex-1 min-w-0 flex justify-between"
                                >
                                    <!-- Left side: Name, Size, Quantity -->
                                    <div class="flex flex-col">
                                        <h3
                                            class="text-white text-sm font-medium truncate"
                                        >
                                            {{
                                                item.ProductSize?.Product?.name
                                            }}
                                        </h3>
                                        <p class="text-white/60 text-sm">
                                            Size:
                                            {{ item.ProductSize?.Size?.size }}
                                        </p>
                                        <p class="text-white/60 text-sm">
                                            Quantity: {{ item.quantity }}
                                        </p>
                                    </div>

                                    <!-- Right side: Price -->
                                    <div class="text-right">
                                        <p
                                            class="text-white text-sm font-medium"
                                        >
                                            {{
                                                formatPrice(
                                                    calculateItemTotal(item),
                                                )
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Totals -->
                        <div class="mt-6 pt-4 border-t border-white/10">
                            <div class="space-y-2">
                                <div class="flex justify-between text-white/60">
                                    <span>Subtotal</span>
                                    <span class="text-white">{{
                                        formatPrice(subtotal)
                                    }}</span>
                                </div>
                                <div class="flex justify-between text-white/60">
                                    <span>Shipping</span>
                                    <span class="text-white"
                                        >To be calculated</span
                                    >
                                </div>
                            </div>
                            <!-- Total -->
                            <div
                                class="flex justify-between text-lg pt-4 mt-2 border-t border-white/10"
                            >
                                <div class="flex items-center gap-1">
                                    <span class="text-white/60">Total</span>
                                    <span class="text-white/60 text-xs"
                                        >IDR</span
                                    >
                                </div>
                                <span class="text-white text-xl">{{
                                    formatPrice(total)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
const user = ref(null)
const cartItems = ref([])
const savedAddresses = ref([])
const selectedAddress = ref(null)
const deliveryOption = ref('profile')
const isSubmitting = ref(false)
const saveAddress = ref(false)

const formData = ref({
    email: '',
    name: '',
    street_address: '',
    subdistrict: '',
    city: '',
    district: '',
    province: '',
    postal_code: '',
    country: 'ID',
})

const provinces = [
    { value: 'Aceh', label: 'Aceh' },
    { value: 'Sumatera Utara', label: 'Sumatera Utara' },
    { value: 'Sumatera Barat', label: 'Sumatera Barat' },
    { value: 'Riau', label: 'Riau' },
    { value: 'Kepulauan Riau', label: 'Kepulauan Riau' },
    { value: 'Jambi', label: 'Jambi' },
    { value: 'Sumatera Selatan', label: 'Sumatera Selatan' },
    { value: 'Kepulauan Bangka Belitung', label: 'Kepulauan Bangka Belitung' },
    { value: 'Bengkulu', label: 'Bengkulu' },
    { value: 'Lampung', label: 'Lampung' },
    { value: 'DKI Jakarta', label: 'DKI Jakarta' },
    { value: 'Banten', label: 'Banten' },
    { value: 'Jawa Barat', label: 'Jawa Barat' },
    { value: 'Jawa Tengah', label: 'Jawa Tengah' },
    { value: 'DI Yogyakarta', label: 'DI Yogyakarta' },
    { value: 'Jawa Timur', label: 'Jawa Timur' },
]

// Computed Properties
const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + calculateItemTotal(item)
    }, 0)
})

const total = computed(() => {
    // For now, just return subtotal. Can add shipping costs later
    return subtotal.value
})

const isFormValid = computed(() => {
    if (deliveryOption.value === 'profile') {
        return selectedAddress.value !== null && selectedAddress.value.id
    } else {
        return (
            formData.value.street_address?.trim() &&
            formData.value.city?.trim() &&
            formData.value.province?.trim() &&
            formData.value.postal_code?.trim()
        )
    }
})

// Methods
const fetchUserData = async () => {
    try {
        const response = await axiosInstance.get('/auth/me')
        if (response.data.status === 'success') {
            user.value = response.data.data
            formData.value.email = user.value.email
        }
    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

const fetchCart = async () => {
    try {
        const response = await axiosInstance.get('/carts')
        if (response.data.status === 'success') {
            cartItems.value = response.data.data.CartItems || []

            // Redirect if cart is empty
            if (cartItems.value.length === 0) {
                router.push('/cart')
            }
        }
    } catch (error) {
        console.error('Error fetching cart:', error)
    }
}

const fetchAddresses = async () => {
    try {
        const response = await axiosInstance.get('/addresses')
        if (response.data.status === 'success') {
            savedAddresses.value = response.data.data || []

            // If there are saved addresses, select the first one by default
            if (savedAddresses.value.length > 0) {
                selectAddress(savedAddresses.value[0])
            } else {
                // If no saved addresses, switch to manual entry
                deliveryOption.value = 'manual'
            }
        }
    } catch (error) {
        console.error('Error fetching addresses:', error)
    }
}

const selectAddress = address => {
    selectedAddress.value = address
}

const setDeliveryOption = option => {
    deliveryOption.value = option
    if (option === 'profile' && savedAddresses.value.length > 0) {
        selectAddress(savedAddresses.value[0])
    }
}

const formatPrice = price => {
    return `Rp${Number(price).toLocaleString()}`
}

const calculateItemTotal = item => {
    return Number(item.ProductSize.Product.price) * item.quantity
}

const getImageUrl = url => {
    if (!url) return '/placeholder-image.jpg'
    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${url}`
}

const placeOrder = async () => {
    if (!isFormValid.value || isSubmitting.value) return

    try {
        isSubmitting.value = true
        let addressToUse = null

        // Handle address based on delivery option
        if (deliveryOption.value === 'profile') {
            if (!selectedAddress.value) {
                throw new Error('Please select a delivery address')
            }
            addressToUse = selectedAddress.value.id
        } else {
            // Manual entry - validate required fields
            if (
                !formData.value.street_address ||
                !formData.value.city ||
                !formData.value.province ||
                !formData.value.postal_code
            ) {
                throw new Error('Please fill in all required address fields')
            }

            // Save new address first
            const addressData = {
                name:
                    formData.value.name ||
                    (saveAddress.value
                        ? 'Default Address'
                        : 'Temporary Address'),
                street_address: formData.value.street_address,
                subdistrict: formData.value.subdistrict,
                city: formData.value.city,
                district: formData.value.district,
                postal_code: formData.value.postal_code,
                province: formData.value.province,
                country: formData.value.country,
            }

            const addressResponse = await axiosInstance.post(
                '/addresses',
                addressData,
            )
            if (addressResponse.data.status === 'success') {
                addressToUse = addressResponse.data.data.id
            } else {
                throw new Error('Failed to create address')
            }
        }

        if (!addressToUse) {
            throw new Error('No valid address selected or created')
        }

        // Create the order with the address
        const response = await axiosInstance.post('/orders', {
            address_id: addressToUse,
        })

        if (response.data.status === 'success') {
            // Clear the cart after successful order
            await axiosInstance.delete('/carts')

            // Reset cart items locally
            cartItems.value = []

            // Remove temporary address if it wasn't meant to be saved
            if (deliveryOption.value === 'manual' && !saveAddress.value) {
                try {
                    await axiosInstance.delete(`/addresses/${addressToUse}`)
                } catch (error) {
                    console.error('Error removing temporary address:', error)
                    // Don't throw here as the order was successful
                }
            }

            // Redirect to order confirmation page
            router.push(`/transaction`)
        } else {
            throw new Error('Failed to create order')
        }
    } catch (error) {
        console.error('Error placing order:', error)
        // Show error to user
        alert(
            error.response?.data?.message ||
                error.message ||
                'Failed to place order',
        )
    } finally {
        isSubmitting.value = false
    }
}

// Lifecycle Hooks
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        router.push('/signin')
        return
    }

    await Promise.all([fetchUserData(), fetchCart(), fetchAddresses()])
})
</script>

<style scoped>
input[type='radio'],
input[type='checkbox'] {
    accent-color: white;
}

.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

select {
    background-color: transparent;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23FFFFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}

select option {
    background-color: black;
    color: white;
}

@media (min-width: 1024px) {
    .grid::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateX(-50%);
    }
}
</style>
