<template>
  <div v-if="loading">loading...</div>

  <div v-else>
    <div v-if="error" class="flex justify-center items-center h-[100dvh] bg-red-50">
      <div class="bg-red-200 border-red-500 border-2 rounded max-w-sm p-4">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h6>Entschuldigung, die Rechnung, die Sie abrufen möchten, existiert nicht oder Sie haben einen ungültigen Rechnungslink.</h6>
        <Button @click="navigateTo('/')" class="w-full mt-1.5 bg-red-500 hover:bg-red-600"
          >Okay</Button> 
      </div>
    </div>
    <div v-if="isDone" class="flex justify-center items-center h-[100dvh] bg-green-50">
      <div class="bg-green-200 border-green-500 border-2 rounded max-w-sm p-4">
        <div class="flex items-center gap-2 mb-4">
          <img src="/favicon.svg" alt="Cubee Logo" class="w-10 h-10" />
          <h6 class="text-xl font-bold">Cubee</h6>
        </div>
        <h6>Hallo, {{ data.partner_name }}</h6>
        <h6 class="my-1">Vielen Dank für die Erstellung Ihrer Rechnung, vielen Dank!</h6>
        <Button @click="generateInvoice" class="w-full my-1.5" variant="primary"
          >Rechnung erneut generieren</Button
        >
        <Button @click="navigateTo('/')" class="w-full bg-green-500 hover:bg-green-600"
          >Okay</Button> 
      </div>
    </div>
    <div
      v-if="!isDone && !error"
      class="flex justify-center items-center h-[100dvh] bg-yellow-50"
    >
      <div
        class="bg-yellow-200 border-yellow-500 border-2 rounded max-w-sm p-4"
      >
        <div class="flex items-center gap-2 mb-4">
          <img src="/favicon.svg" alt="Cubee Logo" class="w-10 h-10" />
          <h6 class="text-xl font-bold">Cubee</h6>
        </div>
        <h6>Hallo, {{ data.partner_name }}</h6>
        <h6 class="my-1">Ihre Rechnung ist zum Download bereit.</h6>
        <Button @click="generateInvoice" class="w-full" variant="primary"
          >Rechnung herunterladen</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  title: "Invoice",
});
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import Button from "~/components/ui/button/Button.vue";

const route = useRoute();
const caseId = route.params.caseId;
const partnerId = route.query.id;
const loading = ref(true);
const isDone = ref(false);

const { data, error } = await useFetch("/api/invoice/download-pdf", {
  method: "POST",
  body: {
    id: caseId,
    partnerId: partnerId,
  },
});

const generateInvoice = async () => {
  if (!data || !data.value) return;
  try {
    const fetched = data.value;
    if (!fetched) return;

    const createdAt = fetched.created_at
      ? new Date(fetched.created_at)
      : new Date();

    const invoiceData = {
      customerName: fetched.partner_name,
      amount: fetched.amount,
      date: createdAt.toISOString().split("T")[0],
      caseId: fetched.invoice_id,
      reportType: fetched.report_type,
      vehicleModelType: fetched.vehicle_make_model,
      companyName: "Cubee",
    };

    const response = await $fetch("/api/invoice", {
      method: "POST",
      body: invoiceData,
    });

    const newWindow = window.open("", "_blank");
    isDone.value = true;
    if (newWindow) {
      newWindow.document.write(response);
      newWindow.document.close();
    }
  } catch (err) {
    console.error("Failed to generate invoice:", err);
  }
};

onMounted(async () => {
  if (data && data.value !== undefined) {
    loading.value = false;
  }
  if (error && error.value !== undefined) {
    loading.value = false;
  }
});
</script>
