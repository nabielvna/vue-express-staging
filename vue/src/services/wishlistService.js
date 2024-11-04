import axiosInstance from '@/utils/axios'

export const wishlistService = {
    // Get wishlist items
    async getWishlist() {
        try {
            const response = await axiosInstance.get('/wishlists')
            return response.data.data.Products || []
        } catch (error) {
            console.error('Error fetching wishlist:', error)
            throw error
        }
    },

    async checkWishlistStatus(productId) {
        try {
            const items = await this.getWishlist()
            return items.some(item => item.id === productId)
        } catch (error) {
            console.error('Error checking wishlist status:', error)
            return false
        }
    },

    // Add item to wishlist
    async addToWishlist(productId) {
        try {
            const response = await axiosInstance.post(`/wishlists/${productId}`)
            return response.data
        } catch (error) {
            console.error('Error adding to wishlist:', error)
            throw error
        }
    },

    // Remove item from wishlist
    async removeFromWishlist(productId) {
        try {
            const response = await axiosInstance.delete(
                `/wishlists/${productId}`,
            )
            return response.data
        } catch (error) {
            console.error('Error removing from wishlist:', error)
            throw error
        }
    },

    async clearWishlist() {
        try {
            const response = await axiosInstance.delete('/wishlists')
            return response.data
        } catch (error) {
            console.error('Error clearing wishlist:', error)
            throw error
        }
    },
}
