<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                    <button
                        @click="router.push(`/admin/${props.type}`)"
                        class="text-zinc-400 hover:text-purple-400 transition-colors duration-200"
                    >
                        <svg
                            class="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                    <div>
                        <h1
                            class="text-3xl font-bold text-white tracking-wider uppercase"
                        >
                            {{ catalogData?.name }}
                        </h1>
                        <p class="text-zinc-400 mt-1 tracking-wide">
                            Manage products in {{ props.type }}
                            {{ catalogData?.name?.toLowerCase() }}
                        </p>
                    </div>
                </div>
                <button
                    @click="openProductModal()"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                    Add New Product
                </button>
            </div>

            <!-- Search and Filters -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Search -->
                <div class="relative">
                    <input
                        type="text"
                        v-model="filters.search"
                        @input="handleSearch"
                        placeholder="Search products..."
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    />
                    <svg
                        class="w-5 h-5 absolute left-3 top-3 text-zinc-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>

                <!-- Price Range -->
                <div class="flex gap-4">
                    <input
                        type="number"
                        v-model="filters.minPrice"
                        @input="handleSearch"
                        placeholder="Min price"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    />
                    <input
                        type="number"
                        v-model="filters.maxPrice"
                        @input="handleSearch"
                        placeholder="Max price"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    />
                </div>

                <!-- Sort -->
                <select
                    v-model="filters.sortBy"
                    @change="handleSearch"
                    class="bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                >
                    <option value="createdAt,DESC">Newest First</option>
                    <option value="createdAt,ASC">Oldest First</option>
                    <option value="price,DESC">Price: High to Low</option>
                    <option value="price,ASC">Price: Low to High</option>
                    <option value="name,ASC">Name: A to Z</option>
                    <option value="name,DESC">Name: Z to A</option>
                </select>
            </div>
        </div>

        <!-- Products Table -->
        <div
            class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-zinc-800">
                    <thead class="bg-zinc-900/50">
                        <tr>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Product Info
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Price
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                {{
                                    props.type === 'categories'
                                        ? 'Collection'
                                        : 'Category'
                                }}
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-800">
                        <tr
                            v-for="product in products"
                            :key="product.id"
                            class="hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div
                                        class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-700"
                                    >
                                        <img
                                            :src="getProductImage(product)"
                                            class="h-16 w-16 object-cover"
                                            :alt="product.name"
                                        />
                                    </div>
                                    <div class="ml-4">
                                        <div
                                            class="text-sm font-medium text-white"
                                        >
                                            {{ product.name }}
                                        </div>
                                        <div
                                            class="mt-1 grid grid-cols-5 gap-2"
                                        >
                                            <div
                                                v-for="size in product.Sizes"
                                                :key="size.id"
                                                class="text-xs px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700"
                                            >
                                                <span class="text-zinc-400"
                                                    >{{ size.size }}:</span
                                                >
                                                <span
                                                    :class="
                                                        getStockColorClass(
                                                            size.ProductSize
                                                                .stock,
                                                        )
                                                    "
                                                >
                                                    {{ size.ProductSize.stock }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-mono text-white">
                                    Rp{{ formatPrice(product.price) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-zinc-300">
                                    {{
                                        props.type === 'categories'
                                            ? product.Collection?.name
                                            : product.Category?.name
                                    }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="
                                        getStatusBadgeClass(
                                            getOverallStatus(product.Sizes),
                                        )
                                    "
                                >
                                    {{
                                        formatStatus(
                                            getOverallStatus(product.Sizes),
                                        )
                                    }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right space-x-3"
                            >
                                <button
                                    @click="openProductModal(product)"
                                    class="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDelete(product)"
                                    class="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div
            v-if="pagination.totalPages > 1"
            class="mt-6 flex justify-center gap-2"
        >
            <button
                v-for="page in pagination.totalPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                    'px-3 py-1 rounded-md text-sm',
                    page === pagination.currentPage
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
                ]"
            >
                {{ page }}
            </button>
        </div>

        <!-- Product Form Modal -->
        <NormalModal
            v-if="showProductModal"
            :title="editingProduct ? 'Edit Product' : 'Add New Product'"
            @close="closeProductModal"
        >
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Product Name -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Product Name
                    </label>
                    <input
                        type="text"
                        v-model="productForm.name"
                        required
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    />
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Description
                    </label>
                    <textarea
                        v-model="productForm.description"
                        rows="3"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    ></textarea>
                </div>

                <!-- Price -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Price
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <span class="text-zinc-400">Rp</span>
                        </div>
                        <input
                            type="number"
                            v-model="productForm.price"
                            required
                            min="0"
                            class="w-full bg-black border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        />
                    </div>
                </div>

                <!-- Alternative Catalog Selection -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        {{
                            props.type === 'categories'
                                ? 'Collection'
                                : 'Category'
                        }}
                    </label>
                    <select
                        v-model="
                            productForm[
                                props.type === 'categories'
                                    ? 'collection_id'
                                    : 'category_id'
                            ]
                        "
                        required
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    >
                        <option value="">
                            Select
                            {{
                                props.type === 'categories'
                                    ? 'Collection'
                                    : 'Category'
                            }}
                        </option>
                        <option
                            v-for="item in alternativeCatalog"
                            :key="item.id"
                            :value="item.id"
                        >
                            {{ item.name }}
                        </option>
                    </select>
                </div>

                <!-- Product Images -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-1">
                        Product Images
                    </label>
                    <input
                        type="file"
                        @change="handleFileChange"
                        multiple
                        accept="image/*"
                        name="assets"
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    />
                </div>

                <!-- Size Stock -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">
                        Stock by Size
                    </label>
                    <div class="mb-4">
                        <label
                            class="block text-sm font-medium text-zinc-400 mb-1"
                        >
                            Select Sizes
                        </label>
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="size in sizes"
                                :key="size.id"
                                type="button"
                                @click="toggleSize(size)"
                                :class="[
                                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200',
                                    selectedSizes.includes(size.id)
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700',
                                ]"
                            >
                                {{ size.size }}
                            </button>
                        </div>
                    </div>
                    <!-- Stock Input for Selected Sizes -->
                    <div class="space-y-3 mt-4">
                        <div
                            v-for="sizeId in selectedSizes"
                            :key="sizeId"
                            class="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800"
                        >
                            <span
                                class="text-sm font-medium text-zinc-300 w-16"
                            >
                                {{ sizes.find(s => s.id === sizeId)?.size }}
                            </span>
                            <div class="flex-1">
                                <input
                                    type="number"
                                    v-model="productForm.sizes[sizeId]"
                                    min="0"
                                    placeholder="Enter stock"
                                    required
                                    class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                />
                            </div>
                            <button
                                type="button"
                                @click="removeSize(sizeId)"
                                class="text-zinc-400 hover:text-red-400 transition-colors duration-200"
                            >
                                <svg
                                    class="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M6 18L18 6M6 6l12 12"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        @click="closeProductModal"
                        class="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                        {{ editingProduct ? 'Save Changes' : 'Add Product' }}
                    </button>
                </div>
            </form>
        </NormalModal>

        <!-- Delete Confirmation Modal -->
        <ConfirmationModal
            v-if="showDeleteModal"
            :is-open="showDeleteModal"
            title="Delete Product"
            :message="`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`"
            confirm-text="Delete"
            confirm-type="danger"
            @close="showDeleteModal = false"
            @cancel="showDeleteModal = false"
            @confirm="handleDelete"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/utils/axios'
import NormalModal from '@/components/NormalModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const router = useRouter()

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['categories', 'collections'].includes(value),
    },
    path: {
        type: String,
        required: true,
    },
})

// State
const catalogData = ref(null)
const products = ref([])
const sizes = ref([])
const selectedSizes = ref([])
const alternativeCatalog = ref([])
const showProductModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)

const productForm = ref({
    name: '',
    description: '',
    price: 0,
    collection_id: '',
    category_id: '',
    sizes: {},
    images: [],
})

const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
})

const filters = ref({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt,DESC',
})

// Initial Data Fetching
onMounted(async () => {
    try {
        await Promise.all([
            fetchCatalogData(),
            fetchSizes(),
            fetchProducts(),
            fetchAlternativeCatalog(),
        ])
    } catch (error) {
        console.error('Error initializing data:', error)
    }
})

// API Calls
async function fetchCatalogData() {
    try {
        const response = await axiosInstance.get(
            `/${props.type}/path/${props.path}`,
        )
        catalogData.value = response.data.data
    } catch (error) {
        console.error('Error fetching catalog data:', error)
    }
}

async function fetchSizes() {
    try {
        const response = await axiosInstance.get('/sizes')
        sizes.value = response.data.data
    } catch (error) {
        console.error('Error fetching sizes:', error)
    }
}

async function fetchAlternativeCatalog() {
    try {
        const endpoint =
            props.type === 'categories'
                ? '/collections/summary'
                : '/categories/summary'
        const response = await axiosInstance.get(endpoint)
        alternativeCatalog.value = response.data.data
    } catch (error) {
        console.error('Error fetching alternative catalog:', error)
    }
}

async function fetchProducts() {
    try {
        const [sortField, sortOrder] = filters.value.sortBy.split(',')
        const params = {
            page: pagination.value.currentPage,
            limit: pagination.value.itemsPerPage,
            search: filters.value.search,
            minPrice: filters.value.minPrice,
            maxPrice: filters.value.maxPrice,
            sortBy: sortField,
            sortOrder,
        }

        const response = await axiosInstance.get(
            `/${props.type}/path/${props.path}`,
            { params },
        )
        products.value = response.data.data.Products
        pagination.value = response.data.data.pagination
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}

// Form Handlers
function handleFileChange(event) {
    productForm.value.images = event.target.files
}

// Dalam fungsi handleSubmit
async function handleSubmit() {
    try {
        const formData = new FormData()

        // Basic info
        formData.append('name', productForm.value.name)
        formData.append('description', productForm.value.description || '')
        formData.append('price', productForm.value.price)

        // Catalog IDs
        formData.append(
            'category_id',
            props.type === 'categories'
                ? catalogData.value.id
                : productForm.value.category_id,
        )
        formData.append(
            'collection_id',
            props.type === 'collections'
                ? catalogData.value.id
                : productForm.value.collection_id,
        )

        // Sizes
        const sizesArray = selectedSizes.value.map(sizeId => ({
            size_id: parseInt(sizeId),
            stock: parseInt(productForm.value.sizes[sizeId] || 0),
        }))
        formData.append('sizes', JSON.stringify(sizesArray))

        // Images - Perbaikan nama field menjadi 'assets'
        if (productForm.value.images?.length > 0) {
            Array.from(productForm.value.images).forEach(file => {
                formData.append('assets', file)
            })
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }

        if (editingProduct.value) {
            await axiosInstance.post(
                `/products/${editingProduct.value.id}`,
                formData,
                config,
            )
        } else {
            await axiosInstance.post('/products', formData, config)
        }

        closeProductModal()
        fetchProducts()
    } catch (error) {
        console.error('Error submitting product:', error)
        // Tambahkan error handling yang lebih detail
        if (error.response) {
            console.error('Response Error:', error.response.data)
        }
    }
}

async function handleDelete() {
    try {
        await axiosInstance.delete(`/products/${productToDelete.value.id}`)
        showDeleteModal.value = false
        fetchProducts()
    } catch (error) {
        console.error('Error deleting product:', error)
    }
}

// Size Management
function toggleSize(size) {
    const index = selectedSizes.value.indexOf(size.id)
    if (index === -1) {
        selectedSizes.value.push(size.id)
        productForm.value.sizes[size.id] = 0
    } else {
        removeSize(size.id)
    }
}

function removeSize(sizeId) {
    const index = selectedSizes.value.indexOf(sizeId)
    if (index > -1) {
        selectedSizes.value.splice(index, 1)
        delete productForm.value.sizes[sizeId]
    }
}

// Modal Management
function openProductModal(product = null) {
    editingProduct.value = product
    selectedSizes.value = []

    if (product) {
        productForm.value = {
            name: product.name,
            description: product.description,
            price: product.price,
            collection_id: product.Collection?.id || '',
            category_id: product.Category?.id || '',
            sizes: {},
            images: [],
        }
        product.Sizes.forEach(size => {
            productForm.value.sizes[size.id] = size.ProductSize.stock
            selectedSizes.value.push(size.id)
        })
    } else {
        productForm.value = {
            name: '',
            description: '',
            price: 0,
            collection_id: '',
            category_id: '',
            sizes: {},
            images: [],
        }
    }
    showProductModal.value = true
}

function closeProductModal() {
    showProductModal.value = false
    editingProduct.value = null
    selectedSizes.value = []
    productForm.value = {
        name: '',
        description: '',
        price: 0,
        collection_id: '',
        category_id: '',
        sizes: {},
        images: [],
    }
}

function confirmDelete(product) {
    productToDelete.value = product
    showDeleteModal.value = true
}

// Utility Functions
const handleSearch = debounce(() => {
    pagination.value.currentPage = 1
    fetchProducts()
}, 300)

function changePage(page) {
    pagination.value.currentPage = page
    fetchProducts()
}

function debounce(fn, delay) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price)
}

function getProductImage(product) {
    if (!product?.ProductAssets?.length) return '/api/placeholder/80/80'
    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${product.ProductAssets[0].asset_url}`
}

function getStockColorClass(stock) {
    if (stock === 0) return 'text-red-400'
    if (stock <= 5) return 'text-yellow-400'
    return 'text-emerald-400'
}

function getOverallStatus(sizes) {
    if (!sizes || !Array.isArray(sizes)) return 'out_of_stock'

    const totalStock = sizes.reduce(
        (sum, size) => sum + size.ProductSize.stock,
        0,
    )
    const hasLowStock = sizes.some(
        size => size.ProductSize.stock > 0 && size.ProductSize.stock <= 5,
    )

    if (totalStock === 0) return 'out_of_stock'
    if (hasLowStock) return 'low_stock'
    return 'in_stock'
}

function getStatusBadgeClass(status) {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full border'
    const statusClasses = {
        in_stock: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50',
        low_stock: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
        out_of_stock: 'bg-red-900/30 text-red-400 border-red-700/50',
    }
    return `${baseClasses} ${statusClasses[status]}`
}

function formatStatus(status) {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
</script>

<style scoped>
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}
</style>
