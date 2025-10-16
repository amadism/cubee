<template>
  <div class="overflow-x-auto border rounded-md font-poppins">
    <table class="min-w-full text-left text-xs lg:text-sm">
      <thead class="bg-gray-100 text-black font-medium">
        <tr class="border-b">
          <th class="w-[5%] border-r p-2 border-gray-200">#</th>
          <th class="w-[15%] border-r p-2 border-gray-200">Created</th>
          <th class="p-2 w-1/5 border-r border-gray-200">Report Type</th>
          <th class="w-1/5 border-r p-2 border-gray-200">Vehicle</th>
          <th class="w-1/5 border-r p-2 border-gray-200">Name</th>
          <th class="w-1/5 border-r p-2 border-gray-200">Location</th>
        </tr>
      </thead>
      <tbody v-show="!loading">
        <tr
          v-for="(item, index) in items"
          :key="item.id"
          class="hover:bg-gray-100 cursor-pointer border-b"
          @click="$emit('select', item)"
        >
          <td class="w-[5%] border-r p-2 border-gray-200">{{ index + 1 }}</td>
          <td class="w-[15%] border-r p-2 truncate">{{ formatDate(item.created_at) }}</td>
          <td class="w-1/5 border-r p-2 truncate">{{ item.report_type }}</td>
          <td class="w-1/5 border-r p-2 truncate">{{ item.vehicle_make_model }}</td>
          <td class="w-1/5 border-r p-2 truncate">{{ item.full_name }}</td>
          <td class="w-1/5 border-r p-2 truncate">{{ item.location_name }}</td>
        </tr>
        <tr v-if="!items?.length">
          <td colspan="7" class="p-3 text-center text-muted-foreground">
            No data
          </td>
        </tr>
      </tbody>
    </table>
    <div class="w-full flex flex-col gap-1" v-if="loading">
          <div v-for="n in 3" :key="n" class="flex items-center min-w-full">
            <div
              v-for="n in 5"
              :key="n"
              class="w-1/5 flex-1 bg-gray-200 border-r p-[1.07rem] border-gray-100 animate-pulse"
            />
          </div>
        </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return diffSeconds <= 0 ? "just now" : `${diffSeconds}s`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
}
</script>
