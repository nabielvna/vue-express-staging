<template>
    <div class="w-full min-h-screen bg-black">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto px-4 flex flex-col justify-center space-y-6"
        >
            <!-- Header -->
            <div class="text-center">
                <h1 class="text-2xl font-bold mb-2 text-white">Welcome Back</h1>
                <p class="text-gray-400">Sign in to your account to continue</p>
            </div>

            <!-- Error -->
            <div
                v-if="storeError"
                :class="`mb-4 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`"
            >
                {{ storeError }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
                <!-- Email Field -->
                <div class="space-y-2">
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        v-model="email"
                        required
                        @blur="validateEmail"
                        @input="validateEmailFormat"
                        autocomplete="email"
                        :aria-invalid="errors.email ? 'true' : 'false'"
                        :aria-describedby="errors.email ? 'email-error' : ''"
                        class="w-full px-4 py-3 rounded-lg border bg-zinc-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                        :class="{
                            'border-red-500': errors.email,
                            'border-green-500': email && !errors.email,
                        }"
                    />
                    <p
                        v-if="errors.email"
                        id="email-error"
                        class="text-red-500 text-sm mt-1"
                    >
                        {{ errors.email }}
                    </p>
                </div>

                <!-- Password Field -->
                <div class="space-y-2">
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-300"
                    >
                        Password
                    </label>
                    <div class="relative group">
                        <input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            required
                            @blur="validatePassword"
                            autocomplete="current-password"
                            :aria-invalid="errors.password ? 'true' : 'false'"
                            :aria-describedby="
                                errors.password ? 'password-error' : ''
                            "
                            class="w-full px-4 py-3 rounded-lg border bg-zinc-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                            :class="{
                                'border-red-500': errors.password,
                                'border-green-500':
                                    password && !errors.password,
                                'pr-12': true,
                            }"
                        />
                        <button
                            type="button"
                            @click="togglePassword"
                            :aria-label="
                                showPassword ? 'Hide password' : 'Show password'
                            "
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none focus:text-white transition-colors"
                        >
                            <span class="sr-only">{{
                                showPassword ? 'Hide password' : 'Show password'
                            }}</span>
                            <svg
                                v-if="showPassword"
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <svg
                                v-else
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        </button>
                    </div>
                    <p
                        v-if="errors.password"
                        id="password-error"
                        class="text-red-500 text-sm mt-1"
                    >
                        {{ errors.password }}
                    </p>
                </div>

                <!-- Remember Me -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            v-model="rememberMe"
                            class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-700 rounded bg-gray-900"
                        />
                        <label
                            for="remember-me"
                            class="ml-2 block text-sm text-gray-300"
                        >
                            Remember me
                        </label>
                    </div>
                    <div class="text-sm">
                        <RouterLink
                            to="/forgot-password"
                            class="font-medium text-white hover:underline focus:outline-none focus:underline"
                        >
                            Forgot password?
                        </RouterLink>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    :disabled="loading || !isFormValid"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <svg
                        v-if="loading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>

                <!-- Sign Up Link -->
                <div class="flex flex-col space-y-2">
                    <p class="text-center text-sm text-gray-400">
                        Don't have an account?
                        <RouterLink
                            to="/signup"
                            class="font-medium text-white hover:underline focus:outline-none focus:underline"
                        >
                            Sign up
                        </RouterLink>
                    </p>
                </div>

                <!-- Error Alert -->
                <div
                    v-if="submitError"
                    class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <span class="block sm:inline">{{ submitError }}</span>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { loading, error: storeError } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const errors = reactive({
    email: '',
    password: '',
})

// Email validation
const validateEmailFormat = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email.value && !emailRegex.test(email.value)) {
        errors.email = 'Please enter a valid email address'
    } else {
        errors.email = ''
    }
}

const validateEmail = () => {
    if (!email.value) {
        errors.email = 'Email is required'
    } else {
        validateEmailFormat()
    }
}

// Password validation
const validatePassword = () => {
    if (!password.value) {
        errors.password = 'Password is required'
    } else if (password.value.length < 8) {
        errors.password = 'Password must be at least 8 characters'
    } else {
        errors.password = ''
    }
}

// Toggle password visibility
const togglePassword = () => {
    showPassword.value = !showPassword.value
}

// Computed property for form validation
const isFormValid = computed(() => {
    return email.value && password.value && !errors.email && !errors.password
})

// Form submission
const handleSubmit = async () => {
    authStore.clearError() // Clear any previous errors
    validateEmail()
    validatePassword()

    if (!isFormValid.value) return

    try {
        await authStore.signin({
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.value,
        })
    } catch (error) {
        console.error('Login error:', error)
    }
}
</script>
