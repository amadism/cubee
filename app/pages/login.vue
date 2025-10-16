<script setup>
definePageMeta({
  layout: 'auth',
})

import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { navigateTo } from '#app'
const user = ref(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const supabase = useSupabaseClient()
const isCheckingAuth = ref(true)
const showPassword = ref(false)

async function onSubmit() {
  errorMessage.value = ''
  loading.value = true
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value.trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmedEmail)) {
    errorMessage.value = 'Please enter a valid email address.'
    loading.value = false
    return
  }

  if (trimmedPassword.length < 7) {
    errorMessage.value = 'Password must be at least 7 characters.'
    loading.value = false
    return
  }

  const { data, error } = await $fetch('/api/auth/login', {
    method: 'POST',
    body: {
      email: trimmedEmail,
      password: trimmedPassword,
    },
  })
  if (error?.code === "invalid_credentials") {
    errorMessage.value = 'Invalid email or password.'
    loading.value = false
    return
  }
  user.value = data.user
  loading.value = false
  navigateTo('/dashboard')
}

onMounted(async () => {
  isCheckingAuth.value = true
  const { data, error } = await supabase.auth.getSession()
  if(error) {
    console.error(error)
  }
  user.value = data.session?.user
  if(user.value) {
   navigateTo('/dashboard')
  }
  isCheckingAuth.value = false
})
</script>

<template>
  <div v-if="isCheckingAuth" class="min-h-[100dvh] flex items-center justify-center px-4">
    <span class="text-sm text-muted-foreground">Loading…</span>
  </div>
  <div v-else class="mx-auto max-w-sm px-4 py-10 min-h-[100dvh] flex flex-col  justify-center">
    <h1 class="mb-6 text-2xl font-semibold">Login</h1>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input id="email" class="focus-visible:ring-yellow-500"
         v-model="email" type="email" placeholder="your email" :disabled="loading" required />
      </div>

      <div class="space-y-2">
        <label for="password" class="text-sm font-medium">Password</label>
        <div class="relative">
        <Input id="password" class="focus-visible:ring-yellow-500" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••" :disabled="loading" required />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 text-xs text-muted-foreground hover:text-foreground"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>

      <div class="pt-2">
        <Button type="submit" :disabled="loading" class="w-full bg-yellow-500 text-gray-800 hover:bg-yellow-500/90">
          <span v-if="!loading">Login</span>
          <span v-else>Logging in…</span>
        </Button>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </form>
  </div>
</template>
