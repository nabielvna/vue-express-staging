<template>
    <div class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
        >
            <h2 class="text-xl sm:text-2xl font-semibold text-white">
                Public Profile
            </h2>
            <span
                v-if="hasChanges"
                class="text-sm text-yellow-400 animate-pulse"
            >
                ● Changes not saved
            </span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
            <!-- Profile Picture Section -->
            <div
                class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
            >
                <!-- Avatar Image -->
                <div class="relative group">
                    <img
                        :src="currentProfilePicture"
                        :alt="userName"
                        class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-zinc-700 bg-zinc-900"
                        @error="handleImageError"
                    />
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        @click="$refs.fileInput.click()"
                    >
                        <span class="text-white text-xs sm:text-sm"
                            >Change Photo</span
                        >
                    </div>
                </div>

                <!-- Upload Controls -->
                <div class="space-y-3 text-center sm:text-left">
                    <div>
                        <h3 class="text-base sm:text-lg font-medium text-white">
                            Profile Picture
                        </h3>
                        <p class="text-xs sm:text-sm text-zinc-400">
                            Upload a new avatar or remove the current one
                        </p>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="file"
                            ref="fileInput"
                            @change="handleFileChange"
                            accept="image/*"
                            class="hidden"
                        />
                        <button
                            type="button"
                            @click="$refs.fileInput.click()"
                            class="px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-white transition-colors"
                        >
                            Upload new
                        </button>
                        <button
                            v-if="hasProfilePicture"
                            type="button"
                            @click="removeProfilePicture"
                            class="px-4 py-2 text-sm font-medium text-red-600 bg-zinc-700 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-red-500 transition-colors"
                        >
                            Remove
                        </button>
                    </div>

                    <div
                        v-if="imageError"
                        class="text-red-400 text-xs sm:text-sm"
                    >
                        {{ imageError }}
                    </div>
                </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Name Field -->
                <div class="space-y-2">
                    <label
                        for="name"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        Full Name
                        <span
                            v-if="isFieldChanged('name')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        v-model="formData.name"
                        :placeholder="authStore.user?.user?.name || ''"
                        @input="handleInputChange('name', $event)"
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors text-sm sm:text-base"
                        :class="{
                            'border-yellow-500': isFieldChanged('name'),
                            'border-red-500 focus:ring-red-500': errors.name,
                        }"
                    />
                    <p
                        v-if="errors.name"
                        class="text-red-400 text-xs sm:text-sm mt-1"
                    >
                        {{ errors.name }}
                    </p>
                </div>

                <!-- Nickname Field -->
                <div class="space-y-2">
                    <label
                        for="nickname"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        Display Name
                        <span
                            v-if="isFieldChanged('nickname')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        v-model="formData.nickname"
                        :placeholder="authStore.user?.user?.nickname || ''"
                        @input="handleInputChange('nickname', $event)"
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-white focus:border-transparent transition-colors text-sm sm:text-base"
                        :class="{
                            'border-yellow-500': isFieldChanged('nickname'),
                        }"
                    />
                    <p class="text-zinc-400 text-xs sm:text-sm">
                        This is how your name will appear publicly
                    </p>
                </div>

                <!-- Phone Number Field -->
                <div class="space-y-2">
                    <label
                        for="phone_number"
                        class="block text-sm font-medium text-zinc-300"
                    >
                        Phone Number
                        <span
                            v-if="isFieldChanged('phone_number')"
                            class="text-yellow-400 ml-2 text-xs"
                        >
                            (Changed)
                        </span>
                    </label>
                    <input
                        id="phone_number"
                        type="tel"
                        v-model="formData.phone_number"
                        :placeholder="
                            authStore.user?.user?.phone_number ||
                            '+1 (555) 000-0000'
                        "
                        @input="handleInputChange('phone_number', $event)"
                        class="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                        :class="{
                            'border-yellow-500': isFieldChanged('phone_number'),
                        }"
                    />
                </div>
            </div>

            <!-- Form Actions -->
            <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-zinc-700 gap-4 sm:gap-0"
            >
                <div class="text-xs sm:text-sm text-zinc-400">
                    <span v-if="hasChanges">
                        Changed fields:
                        <span class="text-yellow-400">{{
                            changedFieldsText
                        }}</span>
                    </span>
                    <span v-else>No changes to save</span>
                </div>

                <div
                    class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto"
                >
                    <button
                        type="button"
                        @click="resetForm"
                        :disabled="loading || !hasChanges"
                        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset Changes
                    </button>
                    <button
                        type="submit"
                        :disabled="loading || !hasChanges"
                        class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center space-x-2"
                    >
                        <svg
                            v-if="loading"
                            class="animate-spin h-4 w-4 text-white"
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
                        <span>{{
                            loading ? 'Saving...' : 'Save Changes'
                        }}</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import axiosInstance from '@/utils/axios'

const authStore = useAuthStore()
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]

// State
const loading = ref(false)
const previewUrl = ref(null)
const fileInput = ref(null)
const imageError = ref('')
const hasImageError = ref(false)
const changedFields = reactive(new Set())

// Form Data
const formData = reactive({
    name: '',
    nickname: '',
    phone_number: '',
})

// Form Errors
const errors = reactive({
    name: '',
})

// Computed Properties
const userName = computed(() => {
    const user = authStore.user?.user
    return user?.nickname || user?.name || 'User'
})

const hasChanges = computed(() => {
    return changedFields.size > 0 || previewUrl.value !== null
})

const currentProfilePicture = computed(() => {
    if (previewUrl.value) return previewUrl.value
    if (hasImageError.value) return '/assets/profiles/default-avatar.png'

    const profileUrl = authStore.user?.user?.profile_picture_url
    return profileUrl
        ? `${BASE_API_URL}/${profileUrl}`
        : '/assets/profiles/default-avatar.png'
})

const hasProfilePicture = computed(() => {
    return previewUrl.value || authStore.user?.user?.profile_picture_url
})

const changedFieldsText = computed(() => {
    return Array.from(changedFields)
        .map(field => {
            const fieldNames = {
                name: 'Full Name',
                nickname: 'Display Name',
                phone_number: 'Phone Number',
                profile_picture: 'Profile Picture',
            }
            return fieldNames[field] || field
        })
        .join(', ')
})

// Methods
const handleImageError = () => {
    hasImageError.value = true
}

const isFieldChanged = fieldName => {
    const currentValue = formData[fieldName]
    const originalValue = authStore.user?.user?.[fieldName] || ''
    return currentValue !== originalValue
}

const handleInputChange = fieldName => {
    if (isFieldChanged(fieldName)) {
        changedFields.add(fieldName)
    } else {
        changedFields.delete(fieldName)
    }
}

const handleFileChange = event => {
    const file = event.target.files[0]
    imageError.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
        imageError.value = 'Please select a valid image file'
        return
    }

    if (file.size > 5 * 1024 * 1024) {
        imageError.value = 'Image size should be less than 5MB'
        return
    }

    previewUrl.value = URL.createObjectURL(file)
    changedFields.add('profile_picture')
}

const removeProfilePicture = () => {
    previewUrl.value = null
    if (authStore.user?.user?.profile_picture_url) {
        changedFields.add('profile_picture')
    }
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const resetForm = () => {
    // Reset form to current auth store values
    formData.name = authStore.user?.user?.name || ''
    formData.nickname = authStore.user?.user?.nickname || ''
    formData.phone_number = authStore.user?.user?.phone_number || ''

    // Reset other states
    previewUrl.value = null
    errors.name = ''
    imageError.value = ''
    changedFields.clear()
    hasImageError.value = false
}

const handleSubmit = async () => {
    try {
        loading.value = true
        errors.name = ''
        imageError.value = ''

        const submitData = new FormData()

        if (changedFields.has('name')) submitData.append('name', formData.name)
        if (changedFields.has('nickname'))
            submitData.append('nickname', formData.nickname)
        if (changedFields.has('phone_number'))
            submitData.append('phone_number', formData.phone_number)

        if (fileInput.value?.files[0]) {
            submitData.append('profile_picture', fileInput.value.files[0])
        }

        const response = await axiosInstance.put(
            '/accounts/profile',
            submitData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )

        if (response.data.status === 'success') {
            // Update auth store
            authStore.setUser(response.data.data)

            // Reset states
            previewUrl.value = null
            changedFields.clear()
            hasImageError.value = false
        }
    } catch (error) {
        console.error('Profile update error:', error)
        alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
        loading.value = false
    }
}

// Initialize
onMounted(() => {
    // Set initial form data from auth store
    formData.name = authStore.user?.user?.name || ''
    formData.nickname = authStore.user?.user?.nickname || ''
    formData.phone_number = authStore.user?.user?.phone_number || ''
})
</script>
