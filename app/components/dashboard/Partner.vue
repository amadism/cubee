<template>
  <div class="pb-12">
    <PartnerTable
      v-model="view"
      :items="items"
      :loading="loading"
      @view-change="onViewChange"
      @edit="onEdit"
      @delete="onAskDelete"
      @add="onAdd"
    />

    <PartnerEditModal
      v-model:open="editOpen"
      :item="selected"
      :mode="view === 'Pending Requests' ? 'review' : 'edit'"
      @saved="load"
    />

    <PartnerCreateModal
      v-model:open="createOpen"
      @saved="load"
    />

    <ConfirmDeleteModal
      v-model:open="deleteOpen"
      :id="selected?.id"
      @deleted="removeSelected"
    />
  </div>
</template>

<script setup>
import PartnerTable from '@/components/dashboard/PartnerTable.vue'
import PartnerEditModal from '@/components/dashboard/PartnerEditModal.vue'
import PartnerCreateModal from '@/components/dashboard/PartnerCreateModal.vue'
import ConfirmDeleteModal from '@/components/dashboard/ConfirmDeleteModal.vue'

const items = ref([])
const loading = ref(false)
const editOpen = ref(false)
const createOpen = ref(false)
const deleteOpen = ref(false)
const selected = ref(null)
const view = ref('Partners')

async function load() {
  loading.value = true
  try {
    const status = view.value === 'Pending Requests' ? 'pending' : 'active'
    const data = await $fetch(`/api/partners?status=${encodeURIComponent(status)}`)
    items.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function onViewChange(val) {
  view.value = val
  load()
}

function onEdit(item) {
  selected.value = item
  editOpen.value = true
}

function onAdd() {
  selected.value = null
  createOpen.value = true
}

function onAskDelete(item) {
  selected.value = item
  deleteOpen.value = true
}

function removeSelected() {
  if (selected.value) {
    items.value = items.value.filter(i => i.id !== selected.value.id)
    selected.value = null
  }
}

onMounted(load)
</script>
