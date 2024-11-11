<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white tracking-wider uppercase">
                Role Management
            </h1>
            <p class="text-zinc-400 mt-1 tracking-wide">
                Manage user roles and permissions
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <!-- Roles Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="role in roles"
                :key="role.id"
                class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
                <!-- Role Header -->
                <div class="p-6 border-b border-zinc-800">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                <svg
                                    class="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-medium text-white capitalize">
                                    {{ role.name }}
                                </h3>
                                <p class="text-sm text-zinc-400">
                                    {{ role.Users?.length || 0 }} users assigned
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Role Users -->
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-sm font-medium text-zinc-400">Members</h4>
                        <button
                            v-if="canManageRole(role)"
                            @click="openManageUsers(role)"
                            class="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Manage Members
                        </button>
                    </div>

                    <!-- User List -->
                    <div class="space-y-3">
                        <div
                            v-for="user in role.Users?.slice(0, 3)"
                            :key="user.id"
                            class="flex items-center space-x-3"
                        >
                            <!-- User Avatar -->
                            <div
                                v-if="user.profile_picture"
                                class="h-8 w-8 rounded-lg overflow-hidden"
                            >
                                <img
                                    :src="getImageUrl(user.profile_picture)"
                                    :alt="user.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div
                                v-else
                                class="h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center"
                            >
                                <span class="text-purple-400 text-sm font-medium">
                                    {{ getInitials(user.name) }}
                                </span>
                            </div>

                            <!-- User Info -->
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-white truncate">
                                    {{ user.name }}
                                </p>
                                <p class="text-xs text-zinc-400 truncate">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>

                        <!-- Show more users indicator -->
                        <div
                            v-if="role.Users?.length > 3"
                            class="text-sm text-zinc-400 pt-2"
                        >
                            And {{ role.Users.length - 3 }} more members
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Manage Users Modal -->
        <NormalModal
            v-if="showUsersModal"
            :title="`Manage ${selectedRole?.name} Users`"
            @close="closeUsersModal"
        >
            <div class="space-y-4">
                <!-- Search Users -->
                <div class="relative">
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search users..."
                        class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <svg
                        class="w-5 h-5 text-zinc-400 absolute right-3 top-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>

                <!-- No Users Message -->
                <div v-if="availableUsers.length === 0" class="text-center py-8">
                    <p class="text-zinc-400">No available users to assign to this role</p>
                </div>

                <!-- User List -->
                <div v-else class="max-h-96 overflow-y-auto space-y-2">
                    <div
                        v-for="user in availableUsers"
                        :key="user.id"
                        class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                    >
                        <div class="flex items-center space-x-3">
                            <!-- User Avatar -->
                            <div
                                v-if="user.profile_picture"
                                class="h-10 w-10 rounded-lg overflow-hidden"
                            >
                                <img
                                    :src="getImageUrl(user.profile_picture)"
                                    :alt="user.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>
                            <div
                                v-else
                                class="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center"
                            >
                                <span class="text-purple-400 text-sm font-medium">
                                    {{ getInitials(user.name) }}
                                </span>
                            </div>

                            <div>
                                <p class="text-sm font-medium text-white">
                                    {{ user.name }}
                                </p>
                                <p class="text-xs text-zinc-400">
                                    {{ user.email }}
                                </p>
                                <p class="text-xs text-zinc-500 mt-0.5">
                                    Current role: {{ user.role || 'User' }}
                                </p>
                            </div>
                        </div>

                        <button
                            v-if="canManageUserRole(user)"
                            @click="addUserToRole(user)"
                            class="px-3 py-1.5 rounded-lg text-sm transition-colors bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Add to {{ selectedRole?.name }}
                        </button>
                    </div>
                </div>
            </div>
        </NormalModal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NormalModal from '@/components/NormalModal.vue'
import axiosInstance from '@/utils/axios'

// Store and state
const authStore = useAuthStore()
const roles = ref([])
const users = ref([])
const loading = ref(false)
const showUsersModal = ref(false)
const selectedRole = ref(null)
const searchQuery = ref('')

// Computed properties
const isSuperAdmin = computed(() =>
    authStore.user?.user?.Role?.name === 'superadmin'
)

const isAdmin = computed(() =>
    authStore.user?.user?.Role?.name === 'admin'
)

const availableUsers = computed(() => {
    if (!users.value || !selectedRole.value) return []

    // First filter users that don't belong to the selected role
    let filtered = users.value.filter(user => {
        // Check if user's role is different from selected role
        return user.role.toLowerCase() !== selectedRole.value.name.toLowerCase()
    })

    // Then apply search filter if there's a search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
    }

    // Additional permission-based filtering
    filtered = filtered.filter(user => {
        // SuperAdmin can manage all users except themselves
        if (isSuperAdmin.value) {
            return user.id !== authStore.user?.id
        }

        // Admin can only manage normal users
        if (isAdmin.value) {
            return !['superadmin', 'admin'].includes(user.role.toLowerCase()) &&
                   user.id !== authStore.user?.id
        }

        return false
    })

    return filtered
})

// API Methods
const fetchRoles = async () => {
    try {
        loading.value = true
        const response = await axiosInstance.get('/roles')
        roles.value = response.data.data
        // console.log(roles.value)
    } catch (error) {
        console.error('Error fetching roles:', error)
        showError('Failed to fetch roles')
    } finally {
        loading.value = false
    }
}

const fetchUsers = async () => {
    try {
        loading.value = true
        const response = await axiosInstance.get('/users')
        users.value = response.data.data.users
    } catch (error) {
        console.error('Error fetching users:', error)
        showError('Failed to fetch users')
    } finally {
        loading.value = false
    }
}

// User Role Management
const addUserToRole = async (user) => {
    if (!selectedRole.value || !canManageUserRole(user)) {
        showError('You do not have permission to manage this user\'s role')
        return
    }

    try {
        loading.value = true
        await axiosInstance.post('/roles/assign', {
            userId: user.id,
            roleId: selectedRole.value.id
        })

        // Refresh roles data to update the UI
        await Promise.all([fetchRoles(), fetchUsers()])

        // Update the local users array to reflect the change
        const userIndex = users.value.findIndex(u => u.id === user.id)
        if (userIndex !== -1) {
            users.value[userIndex].role = selectedRole.value.name
        }

        showSuccess(`User role updated to ${selectedRole.value.name}`)
    } catch (error) {
        console.error('Error updating user role:', error)
        showError(error.response?.data?.message || 'Failed to update user role')
    } finally {
        loading.value = false
    }
}

// Modal Management
const openManageUsers = async (role) => {
    // Only allow superadmin to open manage users modal
    if (!isSuperAdmin.value) {
        showError('Only Super Admin can manage roles')
        return
    }

    selectedRole.value = role
    showUsersModal.value = true
    await fetchUsers()
}

const closeUsersModal = () => {
    showUsersModal.value = false
    selectedRole.value = null
    searchQuery.value = ''
}

// Permission and Utility Methods
const canManageRole = (role) => {
    if (!role) return false
    // Only allow superadmin to manage roles
    return isSuperAdmin.value
}

const canManageUserRole = (user) => {
    if (!user) return false
    // Only allow superadmin to manage user roles
    // Prevent superadmin from modifying their own role
    return isSuperAdmin.value && user.id !== authStore.user?.id
}

const getImageUrl = (url) => {
    if (!url) return null
    return `${import.meta.env.VITE_API_URL}/${url}`
}

const getInitials = (name) => {
    if (!name) return ''
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

// Notifications
const showSuccess = (message) => {
    console.info(message)
}

const showError = (message) => {
    console.error(message)
}

// Lifecycle Hooks
onMounted(async () => {
    await fetchRoles()
})

// Exposed Methods
defineExpose({
    fetchRoles
})
</script>
