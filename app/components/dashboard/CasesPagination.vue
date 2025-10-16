<template>
  <div class="flex items-center justify-end gap-3 py-3">
    
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" :disabled="page <= 1 || loading" @click="$emit('update:page', page - 1)">
        Prev
      </Button>
      <Button variant="outline" size="sm" :disabled="pageSize < 12 || loading" @click="$emit('update:page', page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})
</script>

