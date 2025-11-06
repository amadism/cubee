<template>
  <div class="overflow-x-auto rounded-md font-poppins">
    <div class="flex mb-4 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <Select :default-value="internalView" @update:modelValue="onViewChange">
          <SelectTrigger class="focus:ring-yellow-500">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Partners">Our Partners</SelectItem>
            <SelectItem value="Pending Requests">Pending Requests</SelectItem>
          </SelectContent>
        </Select>
        <input
        v-model="search"
        type="text"
        placeholder="Search by name or location"
        class="w-full sm:w-64 md:w-80 border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-yellow-500 focus:border-2"
      />
      </div>
      <Button @click="$emit('add')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap">Add Partner</Button>
    </div>
    <table class="min-w-full text-left text-xs sm:text-sm lg:text-sm border rounded-md">
      <thead class="bg-gray-100 text-black font-medium">
        <tr class="border-b">
          <th class="w-[5%] border-r p-1.5 sm:p-2 border-gray-200">#</th>
          <th class="w-[15%] border-r p-1.5 sm:p-2 border-gray-200">{{ internalView === 'Pending Requests' ? 'Requested' : 'Created' }}</th>
          <th class="w-[20%] border-r p-1.5 sm:p-2 border-gray-200">Name</th>
          <th class="w-[20%] border-r p-1.5 sm:p-2 border-gray-200 hidden sm:table-cell">{{ internalView === 'Pending Requests' ? 'Email' : 'Notes' }}</th>
          <th class="w-[15%] border-r p-1.5 sm:p-2 border-gray-200 hidden md:table-cell">Tel</th>
          <th class="w-[17%] border-r p-1.5 sm:p-2 border-gray-200">Location</th>
          <th class="w-[8%] p-1.5 sm:p-2">Actions</th>
        </tr>
      </thead>
      <tbody v-show="!loading">
        <tr
          v-for="(item, index) in filtered"
          :key="item.id"
          class="hover:bg-gray-100 border-b"
        >
          <td class="w-[5%] border-r p-1.5 sm:p-2 border-gray-200">{{ index + 1 }}</td>
          <td class="w-[15%] border-r p-1.5 sm:p-2 truncate text-xs">{{ formatDate(item.created_at) }}</td>
          <td class="w-[20%] border-r p-1.5 sm:p-2 truncate font-medium">{{ item.name }}</td>
          <td class="w-[20%] border-r p-1.5 sm:p-2 truncate hidden sm:table-cell" :class="internalView === 'Pending Requests' ? '' : 'bg-green-50 text-green-800 font-bold'">{{ (internalView === 'Pending Requests' ? (item.email || 'not set') : (item.note || 'not set')).substring(0, 12) }}</td>
          <td class="w-[15%] border-r p-1.5 sm:p-2 truncate hidden md:table-cell text-xs">{{ item.tel }}</td>
          <td class="w-[17%] border-r p-1.5 sm:p-2 truncate">{{ item.location_name }}</td>
          <td class="w-[8%] p-1.5 sm:p-2">
            <div class="flex items-center gap-1 sm:gap-2">
              <button class="p-1 rounded hover:bg-gray-200" @click="$emit('edit', item)" aria-label="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712z" />
                  <path d="M3 17.25V21h3.75l11.02-11.02-3.75-3.75L3 17.25z" />
                </svg>
              </button>
              <button class="p-1 rounded hover:bg-gray-200" @click="$emit('delete', item)" aria-label="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 text-red-600">
                  <path fill-rule="evenodd" d="M16.5 4.5V6h3.75a.75.75 0 010 1.5h-1.06l-1.18 12.098A2.25 2.25 0 0115.77 22H8.23a2.25 2.25 0 01-2.24-2.402L4.81 7.5H3.75a.75.75 0 010-1.5H7.5V4.5A2.25 2.25 0 019.75 2.25h4.5A2.25 2.25 0 0116.5 4.5zM9 6h6V4.5a.75.75 0 00-.75-.75h-4.5A.75.75 0 009 4.5V6z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!filtered?.length">
          <td colspan="7" class="p-3 text-center text-muted-foreground text-xs sm:text-sm">No data</td>
        </tr>
      </tbody>
    </table>
    <div class="w-full flex flex-col gap-1" v-if="loading">
      <div v-for="n in 3" :key="n" class="flex items-center min-w-full">
        <div v-for="n in 6" :key="n" class="w-1/8 flex-1 bg-gray-200 border-r p-[1.07rem] border-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  modelValue: { type: String, default: 'Partners' },
})

const emit = defineEmits(['edit', 'delete', 'add', 'update:modelValue', 'view-change'])

const internalView = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function onViewChange(val) {
  internalView.value = val
  emit('view-change', val)
}

const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter((p) =>
    [p.name, p.location_name]
      .map((v) => (v || '').toString().toLowerCase())
      .some((v) => v.includes(q))
  )
})

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  if (diffSeconds < 60) return diffSeconds <= 0 ? 'just now' : `${diffSeconds}s`
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`
  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears}y ago`
}
</script>


