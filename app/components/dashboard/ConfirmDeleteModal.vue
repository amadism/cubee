<template>
  <Teleport to="body">
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-[1000] backdrop-blur-sm">
        <div class="absolute inset-0 bg-black/40" @click="emit('update:open', false)" />
        <div class="absolute inset-0 grid place-items-center p-4">
          <div class="w-full max-w-sm rounded-lg bg-white shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-2">Confirm delete</h3>
            <p class="text-sm text-gray-600 mb-4">Are you sure you want to delete this partner?</p>
            <div class="flex items-center justify-end gap-2">
              <Button variant="outline" @click="emit('update:open', false)">Cancel</Button>
              <Button :disabled="loading" @click="confirm" class="bg-red-600 hover:bg-red-700 text-white">{{ loading ? 'Deleting...' : 'Delete' }}</Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  open: { type: Boolean, default: false },
  id: { type: [String, Number], default: null },
})

const emit = defineEmits(['update:open', 'deleted'])

const loading = ref(false)

async function confirm() {
  if (!props.id) return
  try {
    loading.value = true
    await $fetch(`/api/partners/${props.id}`, { method: 'DELETE' })
    emit('deleted')
    emit('update:open', false)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>


