<template>
    <div v-if="isCheckingAuth" class="min-h-[100dvh] grid place-items-center">
        <span class="text-sm text-muted-foreground">Loading…</span>
    </div>
    <div v-else>
        <div v-if="user && user.app_metadata.role === 'admin'" class="min-h-[100dvh]">
            <div class="min-h-[100dvh]">
                <DashboardSidebar />
                <main class="px-4 lg:px-6">
                    <slot />
                </main>
            </div>
        </div>
        <div v-else class="min-h-[100dvh] grid place-items-center p-6">
            <div class="text-center space-y-4">
                <p class="text-base">You are not authorized to access this page.</p>
                <Button class="bg-yellow-500 text-gray-800 hover:bg-yellow-500/90" @click="goToLogin">{{ loading ? 'Going back..' : "Go to Login" }}</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DashboardSidebar from '@/components/dashboard/Sidebar.vue'
import { Button } from '@/components/ui/button'
import { navigateTo } from '#app'

const user = ref(null)
const isCheckingAuth = ref(true)
const supabase = useSupabaseClient()
const loading = ref(false)

const goToLogin = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/auth/logout', { method: 'POST' })
    if (res?.success) {
      navigateTo('/login', { replace: true })
    }
  } catch (err) {
    console.error('Logout failed:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
        console.error(error)
    }
    user.value = data.session?.user
    if (!user.value) {
        navigateTo('/login')
    }
    isCheckingAuth.value = false
})
</script>