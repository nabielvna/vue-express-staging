<template>
    <div class="w-full bg-black">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto px-4 flex flex-col justify-center space-y-6"
        >
            <!-- Header -->
            <div class="text-center">
                <h1 class="text-2xl font-bold mb-2 text-white">
                    Reset Password
                </h1>
                <p class="text-gray-400">
                    Enter your email address to reset your password
                </p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
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
                        placeholder="Enter your email address"
                        class="w-full px-4 py-3 rounded-lg border bg-zinc-900 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                        :class="{ 'border-red-500': errors.email }"
                    />
                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                        {{ errors.email }}
                    </p>
                </div>

                <!-- Success Message -->
                <div
                    v-if="emailSent"
                    class="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg"
                >
                    <p>
                        Password reset instructions have been sent to your
                        email.
                    </p>
                    <p class="text-sm mt-1">
                        Please check your inbox and spam folder.
                    </p>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    :disabled="loading || emailSent"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                    {{ loading ? 'Sending...' : 'Reset Password' }}
                </button>

                <!-- Back to Sign In -->
                <p class="text-center text-sm text-gray-400">
                    Remember your password?
                    <RouterLink
                        to="/signin"
                        class="font-medium text-white hover:underline"
                    >
                        Sign in
                    </RouterLink>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'

// Form fields
const email = ref('')
const loading = ref(false)
const emailSent = ref(false)
const errors = reactive({
    email: '',
})

// Form submission
const handleSubmit = async () => {
    // Reset errors
    errors.email = ''

    // Basic validation
    if (!email.value) {
        errors.email = 'Email is required'
        return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
        errors.email = 'Please enter a valid email address'
        return
    }

    try {
        loading.value = true
        // Add your password reset logic here
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

        // Show success message
        emailSent.value = true

        console.log('Password reset requested for:', email.value)
    } catch (error) {
        console.error('Password reset error:', error)
        errors.email = 'Failed to send reset instructions. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>
