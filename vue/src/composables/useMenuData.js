import { ref, onMounted } from 'vue'
import { generateMenuConfig } from '../config/MenuConfig'

export const useMenuData = () => {
    const menuConfig = ref([])
    const isLoading = ref(true)
    const error = ref(null)

    // Get the base API URL from environment variables
    const API_URL = import.meta.env.VITE_BASE_API_URL

    const fetchMenuData = async () => {
        try {
            const [collectionsResponse, categoriesResponse] = await Promise.all(
                [
                    fetch(`${API_URL}/collections/summary`),
                    fetch(`${API_URL}/categories/summary`),
                ],
            )

            const collectionsData = await collectionsResponse.json()
            // console.log(collectionsData)
            const categoriesData = await categoriesResponse.json()
            // console.log(categoriesData)

            if (
                collectionsData.status === 'success' &&
                categoriesData.status === 'success'
            ) {
                menuConfig.value = generateMenuConfig(
                    collectionsData.data,
                    categoriesData.data,
                )
            }
        } catch (err) {
            error.value = 'Failed to load menu data'
            console.error('Error loading menu data:', err)
        } finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        fetchMenuData()
    })

    return {
        menuConfig,
        isLoading,
        error,
        refreshMenuData: fetchMenuData,
    }
}
