<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[1000] backdrop-blur-sm">
        <div class="absolute inset-0 bg-black/40" @click="closeOnOverlay" />

        <div class="absolute inset-0 grid place-items-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="open"
              class="relative w-full max-h-[90dvh] max-w-6xl rounded-lg bg-white shadow-lg overflow-x-hidden overflow-y-auto custom-scrollbar"
            >
              <button
                class="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white hover:bg-gray-50 shadow-sm"
                aria-label="Close"
                @click="emit('update:open', false)"
              >
                <span class="text-xl leading-none">×</span>
              </button>

              <div class="flex flex-col lg:flex-row h-full">
                <div class="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                  <div class="mb-4 sm:mb-6">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
                      Case #{{ item?.id }}
                    </h2>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                      Created {{ formatDate(item?.created_at) }}
                    </p>
                  </div>

                  <div v-if="item" class="space-y-3">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h3
                        class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide"
                      >
                        Basic Information
                      </h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Report Type
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.report_type }}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Vehicle
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.vehicle_make_model }}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Full Name
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.full_name }}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Email
                          </p>
                          <p
                            class="text-sm font-semibold text-gray-900 break-all"
                          >
                            {{ item.email }}
                          </p>
                        </div>
                        <div class="space-y-1" v-if="item.zuordnung">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Zuordnung
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.zuordnung }}
                          </p>
                        </div>
                        <div class="space-y-1" v-if="item.mileage">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Mileage
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.mileage }}
                          </p>
                        </div>
                        <div class="space-y-1" v-if="item.previous_damage">
                          <p
                            class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                          >
                            Previous Damage
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{ item.previous_damage }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Location -->
                    <div
                      class="bg-blue-50 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                    >
                      <h3
                        class="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide whitespace-nowrap"
                      >
                        Location:
                      </h3>
                      <div class="flex flex-wrap items-center gap-2 text-xs break-words">
                        {{ item.location_name }} - Lat: {{ item.lat }} · Lon:
                        {{ item.lon }}
                      </div>
                    </div>

                    <!-- Detailed Information -->
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <h3
                        class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide"
                      >
                        Detailed Information
                      </h3>
                      <p
                        class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed break-words"
                      >
                        {{ item.detailed_information }}
                      </p>
                    </div>

                    <!-- Attachments -->
                    <div class="bg-white border border-gray-200 rounded-lg p-4" v-if="attachments?.length">
                      <h3
                        class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide"
                      >
                        Attachments
                      </h3>
                      <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                      >
                        <div
                          v-for="(src, idx) in attachments"
                          :key="idx"
                          class="relative group border border-gray-200 rounded-md overflow-hidden bg-gray-50"
                        >
                          <template v-if="isPdf(src)">
                            <a :href="src" target="_blank" rel="noopener" class="flex items-center justify-center w-full h-32">
                              <div class="flex flex-col items-center justify-center text-gray-600">
                                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6M9 17h6M13 7v4"/>
                                </svg>
                                <span class="text-xs">PDF</span>
                              </div>
                            </a>
                          </template>
                          <template v-else>
                            <a :href="src" target="_blank" rel="noopener">
                              <NuxtImg :src="src" alt="Attachment" class="w-full h-32 object-cover" />
                            </a>
                          </template>
                          <a :href="src" download class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white border border-gray-200 rounded p-1" aria-label="Download">
                            <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="w-full lg:w-80 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 p-4 sm:p-6 flex flex-col"
                >
                  <div class="space-y-4 sm:space-y-6">
                    <div class="mt-0 lg:mt-6" v-if="currentStatus === 'pending'">
                      <h1 class="text-lg sm:text-xl font-bold">PENDING CASE</h1>
                      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                        <Button
                          @click="updateStatus('rejected')"
                          variant="destructive"
                          class="flex-1"
                          :disabled="rejecting || accepting"
                        >
                          {{ rejecting ? "Updating..." : "Reject" }}
                        </Button>
                        <Button
                          @click="updateStatus('accepted')"
                          class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          :disabled="rejecting || accepting"
                        >
                          {{ accepting ? "Updating..." : "Accept" }}
                        </Button>
                      </div>
                    </div>

                    <div
                        v-if="item.partner && currentStatus === 'assigned'"
                          class="mt-2 lg:mt-4 flex flex-col justify-between h-full"
                        >
                       <div class="text-xs sm:text-sm">
                        <h6 class="font-semibold">This case has been assigned to</h6>
                          <h6 class="mb-1 mt-2 rounded-md font-medium">{{ item.partner?.name || "waiting for assignment" }}</h6>
                          <p
                            v-if="item.partner?.location_name"
                            class="text-xs text-gray-500"
                          >
                            {{ item.partner?.location_name }}
                          </p>
                       </div>

                       <div class="w-full h-[1px] bg-gray-200 my-2" />
                       <label for="amount" class="text-xs font-medium">Set Amount for Invoice</label>
                       <Input type="number" id="amount" placeholder="100€" v-model="amount" class="text-sm" />
                       <p class="text-red-500 text-xs mt-1" v-if="amountError">
                        Please enter a valid amount
                       </p>
                          <Button 
                            class="mt-2 w-full text-sm" 
                            variant="primary"
                            @click="generateInvoice"
                            :disabled="generatingInvoice"
                          >
                            {{ generatingInvoice ? 'Generating...' : 'Generate Invoice' }}
                          </Button>
                        </div>                        

                        <div v-if="currentStatus === 'accepted'" class="mt-2 lg:mt-4">
                        <h3
                          class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2"
                        >
                          Nearest partners
                        </h3>
                        <div
                          v-if="loading"
                          class="mt-2 flex items-center justify-center py-4"
                        >
                          <div
                            class="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <div
                              class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"
                            ></div>
                            Loading partners...
                          </div>
                        </div>
                        <div
                          v-else-if="nearestPartners.length"
                          class="mt-2 space-y-2 max-h-64 overflow-y-auto"
                        >
                          <div
                            v-for="p in nearestPartners"
                            :key="p.id"
                            class="border border-gray-200 bg-white p-2 rounded"
                          >
                            <h3
                              class="text-xs sm:text-sm font-semibold text-gray-900 leading-tight"
                            >
                              {{ p.name }}
                            </h3>
                            <h6 class="text-xs text-gray-500 leading-tight">
                              {{ p.location_name }}
                            </h6>
                            <div
                              class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 rounded-md bg-green-100 p-1 sm:p-0.5 mt-2"
                            >
                              <div class="flex items-center gap-1">
                                <svg
                                  class="w-3 h-3 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span
                                  class="text-xs font-medium mt-0.5 text-gray-700"
                                  >{{ p._distanceLabel }}</span
                                >
                              </div>

                              <button
                              v-if="!p.isInvited"
                                @click="sendProposal(p.id, p.name, p.tel)"
                                class="flex items-center justify-center gap-1 py-1 sm:py-0.5 px-2 sm:px-1 bg-green-300 m-[1px] rounded-md hover:scale-105 transition-all duration-200"
                              >
                                <span
                                  class="text-[10px] sm:text-[10px] font-medium text-green-700"
                                >
                                  {{ sendingTo === p?.id ? "Sending..." : "Send Proposal" }}
                                </span>
                                <svg
                                  class="w-3 h-3 rotate-90 text-green-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  />
                                </svg>
                              </button>
                              <span v-else class="text-xs text-green-500 px-2 italic text-center sm:text-left">
                                Invited
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-else class="mt-2 text-xs text-gray-500 italic">
                          No partners found nearby
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";
import { Button } from "@/components/ui/button";
import { distanceBetween } from "@/composables/useDistance";

const props = defineProps({
  open: { type: Boolean, default: false },
  item: { type: Object, default: null },
});

const emit = defineEmits(["update:open", "status-updated"]);

const currentStatus = ref("");
const rejecting = ref(false);
const accepting = ref(false);
const partners = ref([]);
const loading = ref(false);
const generatingInvoice = ref(false);

const nearestPartners = computed(() => {
  
  if (loading.value) {
    return [];
  }

  const item = props.item;
  if (!item || typeof item.lat !== "number" || typeof item.lon !== "number") {
    return [];
  }
  const origin = { lat: item.lat, lng: item.lon };

  function formatMeters(meters) {
    const unit = meters >= 1000 ? "km" : "m";
    if (unit === "km") {
      let km = meters / 1000;
      const shouldRound = km >= 10;
      if (shouldRound) km = Math.round(km);
      return `${shouldRound ? km : km.toFixed(2)} ${unit}`;
    }
    return `${Math.round(meters)} ${unit}`;
  }

  const filteredPartners = partners.value
    .filter((p) => typeof p?.lat === "number" && typeof p?.lon === "number");
  
  
  const result = filteredPartners
    .map((p) => {
      const meters = distanceBetween(origin, { lat: p.lat, lng: p.lon });
      return {
        ...p,
        _distanceMeters: meters,
        _distanceLabel: formatMeters(meters),
        isInvited: props.item.invited ? props.item.invited.includes(String(p.id)) : false,
      };
    })
    .sort((a, b) => a._distanceMeters - b._distanceMeters)
    ;
    
  return result;
});

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      currentStatus.value = newItem.status || "";
    }
  },
  { immediate: true }
);

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      loading.value = true;
      try {
        const data = await $fetch("/api/partners", {
          params: { status: 'active' }
        });
        partners.value = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error("Failed to load partners:", e);
        try {
          const publicData = await $fetch("/api/partners/public");
          partners.value = Array.isArray(publicData) ? publicData : [];
        } catch (publicError) {
          console.error("Failed to load public partners:", publicError);
          partners.value = [];
        }
      }
      
      loading.value = false;
    }
  }
);

async function updateStatus(newStatus) {
  if (!props.item?.id || newStatus === props.item.status) return;
  if (newStatus === "accepted") {
    accepting.value = true;
    rejecting.value = false;
  } else if (newStatus === "rejected" || newStatus === "pending") {
    rejecting.value = true;
    accepting.value = false;
  }
  try {
    await $fetch(`/api/cases/${props.item.id}`, {
      method: "PUT",
      body: { status: newStatus },
    });

    emit("status-updated", props.item.id);

    emit("update:open", false);
  } catch (error) {
    console.error("Failed to update status:", error);
    currentStatus.value = props.item.status;
  } finally {
    rejecting.value = false;
    accepting.value = false;
  }
}

const attachments = computed(() => {
  const att = props.item?.attachments;
  if (!att) return [];
  if (Array.isArray(att)) return att;
  if (typeof att === "string") return [att];
  return [];
});

function isPdf(url) {
  if (!url) return false;
  const lower = String(url).toLowerCase();
  if (lower.includes('application/pdf')) return true;
  try {
    const u = new URL(lower, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    if (u.pathname.endsWith('.pdf')) return true;
  } catch {}
  return lower.endsWith('.pdf');
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString();
}

function onKeydown(e) {
  if (e.key === "Escape" && props.open) emit("update:open", false);
}

function closeOnOverlay() {
  emit("update:open", false);
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});


const sendingTo = ref('');
const sendProposal = async (partnerId, partnerName, partnerTel) => {
  if (!partnerId || !partnerName || !partnerTel) {
    console.error('Partner data incomplete. Cannot send proposal.', { partnerId, partnerName, partnerTel })
    return;
  }
  try {
    sendingTo.value = partnerId;
    const res = await $fetch("/api/cases/send-proposal", {
      method: "PUT",
      body: {
        partnerId: partnerId,
        partnerName: partnerName,
        partnerTel: String(partnerTel),
        caseId: props.item.id,
        claimCode: props.item.claim_code
      },
    });
    if (res.success) {
      nearestPartners.value.find(p => p.id === partnerId).isInvited = true;
    } else {
      console.error("Failed to send proposal:", res.whatsapp.error);
    }
  } catch (error) {
    console.error("Failed to send proposal:", error);
  } finally {
    sendingTo.value = '';
  }
};

const amount = ref(null)
const amountError = ref(false)

const generateInvoice = async () => {
  if (!props.item) return;
  if (!amount.value) {
    amountError.value = true;
    return;
  }
  amountError.value = false;
  generatingInvoice.value = true;

  try {
    const data = await $fetch('/api/invoice/create', {
      method: 'POST',
      body: {
        id: props.item.id,
        partnerId: props.item.assigned_to || null,
        amount: parseFloat(amount.value),
        partnerName: props.item.partner?.name || null,
        tel: props.item.partner?.tel || null
      }
    });
    console.log('Invoice created:', data);
  } catch (err) {
    console.error('Failed to generate invoice:', err);
  } finally {
    await updateStatus('completed');
    generatingInvoice.value = false;

  }
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>
