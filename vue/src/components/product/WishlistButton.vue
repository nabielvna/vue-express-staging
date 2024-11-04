<template>
    <button
        @click.stop.prevent="toggleWishlist"
        :class="[
            'absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all duration-200',
            isInWishlist
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
        ]"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :class="[
                'w-5 h-5 transition-colors duration-200',
                isInWishlist
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-white fill-none hover:fill-white/10',
            ]"
            viewBox="0 0 24 24"
            stroke-width="2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
        </svg>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { wishlistService } from '@/services/wishlistService'

const props = defineProps({
    productId: {
        type: String,
        required: true,
    },
})

const isInWishlist = ref(false)
const isLoading = ref(false)

const checkWishlistStatus = async () => {
    try {
        isInWishlist.value = await wishlistService.checkWishlistStatus(
            props.productId,
        )
    } catch (error) {
        console.error('Error checking wishlist status:', error)
    }
}

const toggleWishlist = async () => {
    if (isLoading.value) return

    try {
        isLoading.value = true

        if (isInWishlist.value) {
            await wishlistService.removeFromWishlist(props.productId)
            isInWishlist.value = false
        } else {
            await wishlistService.addToWishlist(props.productId)
            isInWishlist.value = true
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    checkWishlistStatus()
})
</script>
