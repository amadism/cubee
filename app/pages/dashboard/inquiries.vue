<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Inquiries</h2>

    <div v-if="pending" class="text-gray-500">Loading inquiries...</div>
    <div v-else>
      <div class="overflow-x-auto border rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="inq in sortedInquiries" :key="inq.id" class="hover:bg-gray-50 cursor-pointer" @click="openModal(inq)">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ inq.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ inq.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ inq.email }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 max-w-xs">
                <span class="line-clamp-1">{{ truncateMessage(inq.message) }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <span :class="statusClass(inq.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{{ inq.status || 'pending' }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatDate(inq.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="sortedInquiries.length === 0" class="text-center text-gray-500 py-8">No inquiries found.</div>
    </div>

    <!-- Modal with CaseDetailsModal-like transitions -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showModal && selectedInquiry" class="fixed inset-0 z-[1000] backdrop-blur-sm">
          <div class="absolute inset-0 bg-black/40" @click="closeModal" />

          <div class="absolute inset-0 grid place-items-center p-4">
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="showModal" class="relative w-full max-h-[90dvh] max-w-xl rounded-lg bg-white shadow-lg overflow-hidden">
                <button
                  class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white hover:bg-gray-50 shadow-sm"
                  aria-label="Close"
                  @click="closeModal"
                >
                  <span class="text-xl leading-none">×</span>
                </button>
                <div class="px-6 py-4 border-b">
                  <h3 class="text-lg font-semibold text-gray-900">Inquiry #{{ selectedInquiry?.id }}</h3>
                  <p class="text-xs text-gray-500 mt-1">Created {{ formatDate(selectedInquiry?.created_at) }}</p>
                </div>
                <div class="px-6 py-4 space-y-2 overflow-y-auto max-h-[65vh]">
                  <p><span class="font-semibold">Name:</span> {{ selectedInquiry?.name }}</p>
                  <p class="break-all"><span class="font-semibold">Email:</span> {{ selectedInquiry?.email }}</p>
                  <p><span class="font-semibold">Status:</span> {{ selectedInquiry?.status || 'pending' }}</p>
                  <div>
                    <div class="font-semibold mb-1">Message</div>
                    <p class="whitespace-pre-wrap break-words">{{ selectedInquiry?.message }}</p>
                  </div>
                </div>
                <div class="px-6 py-4 border-t flex items-center gap-2">
                  <button :disabled="deleting" class="p-2 rounded flex-1 bg-red-500 text-white hover:bg-red-600" @click="deleteInquiry(selectedInquiry!)" aria-label="Delete">
                    {{ deleting ? 'Deleting...' : 'Delete' }}
                  </button>
                  <button :disabled="marking" class="p-2 flex-1 rounded bg-green-500 text-white hover:bg-green-600" @click="markRead(selectedInquiry!)" aria-label="Mark as read">
                    {{ marking ? 'Marking as read...' : 'Mark as read' }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { ref, computed } from 'vue'
const deleting = ref(false)
const marking = ref(false)

type Inquiry = {
  id: number | string
  name: string
  email: string
  message: string
  status?: string
  created_at?: string
}

const showModal = ref(false)
const selectedInquiry = ref<Inquiry | null>(null)

const { data, status, pending } = useFetch<Inquiry[] | null>('/api/inquiry', {
  default: () => [],
  server: true,
})

const inquiries = computed<Inquiry[]>(() => (Array.isArray(data.value) ? data.value : []))

const sortedInquiries = computed<Inquiry[]>(() => {
  return [...inquiries.value].sort((a, b) => {
    const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
    const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
    return bDate - aDate
  })
})

function truncateMessage(message: string, length = 80): string {
  if (!message) return ''
  return message.length > length ? message.slice(0, length) + '…' : message
}

function statusClass(status?: string) {
  const s = (status || 'pending').toLowerCase()
  if (s === 'read') return 'bg-green-100 text-green-800'
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

function formatDate(date?: string) {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleString()
  } catch {
    return date
  }
}

function openModal(inq: Inquiry) {
  selectedInquiry.value = inq
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedInquiry.value = null
}

async function deleteInquiry(inq: Inquiry) {
  if (!inq?.id) return
  try {
    deleting.value = true
    await $fetch(`/api/inquiry/${inq.id}`, { method: 'DELETE' })
    if (Array.isArray(data.value)) {
      data.value = data.value.filter((x: any) => x.id !== inq.id)
    }
    deleting.value = false
    if (selectedInquiry.value?.id === inq.id) closeModal()
  } catch (e) {
    deleting.value = false
    console.error(e)
  }
}

async function markRead(inq: Inquiry) {
  if (!inq?.id) return
  try {
    marking.value = true
    await $fetch(`/api/partners/mark-read`, { method: 'POST', body: { id: inq.id } })
    if (Array.isArray(data.value)) {
      data.value = data.value.filter((x: any) => x.id !== inq.id)
    }
    marking.value = false
    if (selectedInquiry.value) selectedInquiry.value = { ...selectedInquiry.value, status: 'read' }
  } catch (e) {
    marking.value = false
    console.error(e)
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
}
</style>


