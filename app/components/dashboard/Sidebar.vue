<template>
  <nav class="px-4 lg:px-6 py-3 mb-4 border-b flex items-center justify-between">
    <div class="flex items-end gap-6 ">
      <img src="/favicon.svg" alt="Cubee" class="w-10 h-10">
      <ul class="flex items-center gap-3">
        <li>
          <NuxtLink :class="linkClass('/dashboard')" to="/dashboard">Cases</NuxtLink>
        </li>
        <li>
          <NuxtLink :class="linkClass('/dashboard/partners')" to="/dashboard/partners">Partners</NuxtLink>
        </li>
        <li>
          <NuxtLink :class="linkClass('/dashboard/inquiries')" to="/dashboard/inquiries">Inquiries</NuxtLink>
        </li>
      </ul>
    </div>

    <h1 v-if="loading" class="h-4 w-4 border-2 border-black border-l-transparent animate-spin rounded-full" />
    <svg v-else @click="logOut" xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8 p-1 rounded-md transition-all cursor-pointer hover:bg-red-500/50 text-black" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  </nav>
</template>

<script setup>
import { navigateTo } from '#app'
import { ref } from 'vue'
const route = useRoute()
function linkClass(target) {
  const active = route.path === target
  return [
    'block rounded-md px-3 py-2 text-sm transition-colors',
    active ? 'bg-yellow-100 text-yellow-900 font-medium' : 'text-gray-700 hover:bg-gray-100'
  ]
}
const loading = ref(false)

const logOut = async () => {
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
</script>
