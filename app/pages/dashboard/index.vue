<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
      <div class="w-full sm:w-64">
        <Select v-model="status">
          <SelectTrigger aria-label="Status" class="focus:ring-yellow-500">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="assigned">In Progress (Assigned)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <span v-if="loading" class="text-sm text-gray-500">Loading...</span>
    </div>

    <CasesTable :items="cases" :loading="loading" @select="onSelect" />
    <CasesPagination :page="page" :pageSize="cases.length" :loading="loading" @update:page="(p) => { page = p; fetchCases() }" />

    <CaseDetailsModal v-model:open="detailsOpen" :item="selected" @status-updated="onStatusUpdated" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import CasesTable from '@/components/dashboard/CasesTable.vue'
import CasesPagination from '@/components/dashboard/CasesPagination.vue'
import CaseDetailsModal from '@/components/dashboard/CaseDetailsModal.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

definePageMeta({ layout: 'admin' })

let page = ref(1)
const pageSize = ref(12)
const cases = ref([])
const loading = ref(false)
const status = ref('pending')

const detailsOpen = ref(false)
const selected = ref(null)

function onSelect(item) {
  selected.value = item
  detailsOpen.value = true
}

function onStatusUpdated(caseId) {
  cases.value = cases.value.filter(caseItem => caseItem.id !== caseId)
}

async function fetchCases() {
  loading.value = true
  try {
    const res = await $fetch('/api/cases', { params: { page: page.value, pageSize: pageSize.value, status: status.value } })
    cases.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCases)

watch(status, () => {
  page.value = 1
  fetchCases()
})
</script>