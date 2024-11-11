<template>
    <div class="fixed inset-0 z-50 overflow-y-auto">
        <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
            <!-- Overlay -->
            <div
                class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                aria-hidden="true"
            ></div>

            <!-- Modal Panel -->
            <div
                class="inline-block align-bottom bg-zinc-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
                <!-- Modal Header -->
                <div class="bg-zinc-900 px-4 pt-5 pb-4 sm:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium text-white">
                            {{ isEditing ? 'Edit Product' : 'Add New Product' }}
                        </h3>
                        <button
                            @click="closeModal"
                            class="text-zinc-400 hover:text-white rounded-lg p-1 hover:bg-zinc-800/50 transition-colors"
                        >
                            <svg
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <!-- Name -->
                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                            >
                                Product Name
                            </label>
                            <input
                                type="text"
                                v-model="form.name"
                                class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                required
                                :class="{ 'border-red-500': errors.name }"
                            />
                            <p
                                v-if="errors.name"
                                class="mt-1 text-sm text-red-500"
                            >
                                {{ errors.name }}
                            </p>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                                >Description</label
                            >
                            <textarea
                                v-model="form.description"
                                rows="12"
                                class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 font-mono"
                                placeholder="Enter product description..."
                            ></textarea>
                            <p class="mt-1 text-xs text-zinc-500">
                                Use new lines to format the description
                            </p>
                        </div>

                        <!-- Price -->
                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                            >
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
                                    v-model="form.price"
                                    class="w-full bg-black border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                    required
                                    min="0"
                                    :class="{ 'border-red-500': errors.price }"
                                />
                            </div>
                            <p
                                v-if="errors.price"
                                class="mt-1 text-sm text-red-500"
                            >
                                {{ errors.price }}
                            </p>
                        </div>

                        <!-- Size Stock -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <label
                                    class="text-sm font-medium text-zinc-400"
                                >
                                    Stock by Size
                                </label>
                                <div
                                    class="bg-purple-900/30 px-3 py-1 rounded-lg border border-purple-700/50"
                                >
                                    <span
                                        class="text-sm font-medium text-purple-200"
                                    >
                                        Total Stock:
                                        <span class="text-purple-300 font-mono">
                                            {{ calculateTotalStock }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div
                                    v-for="size in availableSizes"
                                    :key="size"
                                    class="relative bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/50"
                                >
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <label
                                            :for="'size-' + size"
                                            class="text-sm font-medium text-zinc-300 mb-2"
                                        >
                                            Size {{ size }}
                                        </label>
                                        <span
                                            :class="
                                                getStockBadgeClass(
                                                    form.sizeStock[size] || 0,
                                                )
                                            "
                                        >
                                            {{
                                                getStockLabel(
                                                    form.sizeStock[size] || 0,
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <input
                                        :id="'size-' + size"
                                        type="number"
                                        v-model.number="form.sizeStock[size]"
                                        class="w-full bg-black/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Category -->
                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                            >
                                Category
                            </label>
                            <select
                                v-model="form.category"
                                class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                required
                                :class="{ 'border-red-500': errors.category }"
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                <option
                                    v-for="category in categories"
                                    :key="category"
                                    :value="category"
                                >
                                    {{ formatCategory(category) }}
                                </option>
                            </select>
                            <p
                                v-if="errors.category"
                                class="mt-1 text-sm text-red-500"
                            >
                                {{ errors.category }}
                            </p>
                        </div>

                        <!-- Collection -->
                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                            >
                                Collection
                            </label>
                            <select
                                v-model="form.collection"
                                class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                :class="{ 'border-red-500': errors.collection }"
                            >
                                <option value="">Select Collection</option>
                                <option
                                    v-for="collection in collections"
                                    :key="collection.id"
                                    :value="collection.id"
                                >
                                    {{ collection.name }}
                                </option>
                            </select>
                            <p
                                v-if="errors.collection"
                                class="mt-1 text-sm text-red-500"
                            >
                                {{ errors.collection }}
                            </p>
                        </div>

                        <!-- Image Upload Section -->
                        <div>
                            <label
                                class="block text-sm font-medium text-zinc-400 mb-1"
                            >
                                Product Image
                            </label>
                            <div
                                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-lg hover:border-purple-500/50 transition-colors"
                            >
                                <div class="space-y-2 text-center">
                                    <div v-if="imagePreview" class="mb-4">
                                        <img
                                            :src="imagePreview"
                                            alt="Preview"
                                            class="mx-auto h-32 w-32 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div v-else class="mx-auto h-12 w-12">
                                        <svg
                                            class="mx-auto h-12 w-12 text-zinc-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div class="flex text-sm text-zinc-400">
                                        <label
                                            for="file-upload"
                                            class="relative cursor-pointer rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                accept="image/*"
                                                class="sr-only"
                                                @change="handleImageUpload"
                                            />
                                        </label>
                                        <p class="pl-1">or drag and drop</p>
                                    </div>
                                    <p class="text-xs text-zinc-400">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                            <p
                                v-if="errors.image"
                                class="mt-1 text-sm text-red-500"
                            >
                                {{ errors.image }}
                            </p>
                        </div>
                    </form>
                </div>

                <!-- Modal Footer -->
                <div
                    class="bg-zinc-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                >
                    <button
                        @click="handleSubmit"
                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        :disabled="isSubmitting"
                    >
                        <template v-if="isSubmitting">
                            <svg
                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </template>
                        <template v-else>
                            {{ isEditing ? 'Save Changes' : 'Add Product' }}
                        </template>
                    </button>
                    <button
                        @click="closeModal"
                        class="mt-3 w-full inline-flex justify-center rounded-lg border border-zinc-600 shadow-sm px-4 py-2 bg-black text-base font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        :disabled="isSubmitting"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    product: {
        type: Object,
        default: null,
    },
    categories: {
        type: Array,
        required: true,
    },
    collections: {
        type: Array,
        required: true,
    },
    availableSizes: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue', 'save'])

// Form State
const isSubmitting = ref(false)
const errors = ref({})
const imagePreview = ref(null)
const imageFile = ref(null)
const defaultForm = {
    name: '',
    description: '',
    price: 0,
    category: '',
    sizeStock: {},
    collection: '',
    image: null,
}

const form = ref({ ...defaultForm })

const handleImageUpload = event => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
        errors.value.image = 'Please upload an image file (PNG, JPG, GIF)'
        return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        errors.value.image = 'Image size should be less than 10MB'
        return
    }

    // Clear previous error
    errors.value.image = ''

    // Store file for form submission
    imageFile.value = file

    // Create preview URL
    imagePreview.value = URL.createObjectURL(file)

    // Update form data
    form.value.image = file
}

// Computed
const isEditing = computed(() => !!props.product)

// Methods
const initializeSizeStock = () => {
    const sizeStock = {}
    props.availableSizes.forEach(size => {
        sizeStock[size] = 0
    })
    return sizeStock
}

const formatCategory = category => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

// Add new computed property for total stock
const calculateTotalStock = computed(() => {
    return Object.values(form.value.sizeStock).reduce((sum, stock) => {
        const stockNumber = Number(stock) || 0
        return sum + stockNumber
    }, 0)
})

// Update stock label function to show actual numbers
const getStockLabel = stock => {
    const stockNum = Number(stock) || 0
    if (stockNum > 10) return `${stockNum} • In Stock`
    if (stockNum > 0) return `${stockNum} • Low`
    return '0 • Out'
}

// Update stock badge class to handle undefined values
const getStockBadgeClass = stock => {
    const stockNum = Number(stock) || 0
    const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium'
    if (stockNum > 10)
        return `${baseClasses} bg-emerald-500/20 text-emerald-400`
    if (stockNum > 0) return `${baseClasses} bg-yellow-500/20 text-yellow-400`
    return `${baseClasses} bg-red-500/20 text-red-400`
}

const validateForm = () => {
    const newErrors = {}

    if (!form.value.name.trim()) {
        newErrors.name = 'Product name is required'
    }

    if (form.value.price <= 0) {
        newErrors.price = 'Price must be greater than 0'
    }

    if (!form.value.category) {
        newErrors.category = 'Category is required'
    }

    // Add image validation if needed
    if (!isEditing.value && !form.value.image) {
        newErrors.image = 'Product image is required'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        isSubmitting.value = true

        // Create FormData for multipart/form-data submission
        const formData = new FormData()

        // Append all form fields
        Object.keys(form.value).forEach(key => {
            if (key === 'sizeStock') {
                formData.append(key, JSON.stringify(form.value[key]))
            } else if (key === 'image' && form.value[key] instanceof File) {
                formData.append('image', form.value[key])
            } else {
                formData.append(key, form.value[key])
            }
        })

        // Add last updated date
        formData.append('lastUpdated', new Date().toISOString().split('T')[0])

        emit('save', formData)
        closeModal()
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value)
        imagePreview.value = null
        imageFile.value = null
    }

    emit('update:modelValue', false)
    form.value = { ...defaultForm }
    errors.value = {}
}

// Lifecycle
onMounted(() => {
    if (props.product) {
        form.value = {
            ...props.product,
            sizeStock: { ...props.product.sizeStock },
        }
        // Set image preview if product has an image
        if (props.product.image) {
            imagePreview.value = props.product.image
        }
    } else {
        form.value.sizeStock = initializeSizeStock()
    }
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
}

/* Form focus styles */
input:focus,
select:focus {
    outline: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #52525b;
}
</style>
