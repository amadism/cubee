<template>
  <div>
    <div class="max-w-4xl mx-auto px-2 sm:px-4">
      <Card class="bg-gradient-to-br from-white to-yellow-50">
        <CardHeader class="bg-gray-100 border-b rounded-t-lg py-4 sm:py-6" :class="isSubmitting ? '' : 'mb-4'">
          <CardTitle class="text-xl sm:text-2xl font-bold text-center font-poppins text-gray-900 px-2">
            {{ csT("$form.title") }}
          </CardTitle>
          <!-- Stepper -->
          <div class="flex justify-center mt-4 sm:mt-6 text-xs sm:text-sm lg:text-xs overflow-hidden px-2">
            <div class="flex items-center flex-wrap lg:justify-center md:justify-center gap-2 lg:gap-0 lg:flex-nowrap w-full max-w-3xl">
              <!-- Step 1 -->
              <div class="flex items-center space-x-2 lg:flex-1">
                <span :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300',
                  currentStep >= 1
                    ? 'bg-yellow-400 text-gray-700 border-yellow-400'
                    : 'bg-white text-gray-500 border-gray-300',
                ]">
                  1
                </span>
                <span class="text-nowrap" :class="currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'">
                  {{ csT("$form.steps.1") }}
                </span>
              </div>

              <!-- Divider -->
              <div class="hidden lg:block flex-1 mx-2 h-px" :class="currentStep >= 2 ? 'bg-yellow-400' : 'bg-gray-300'"></div>

              <!-- Step 2 -->
              <div class="flex items-center space-x-2 lg:flex-1 lg:justify-center">
                <span :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300',
                  currentStep >= 2
                    ? 'bg-yellow-400 text-gray-700 border-yellow-400'
                    : 'bg-white text-gray-500 border-gray-300',
                ]">
                  2
                </span>
                <span class="text-nowrap" :class="currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'">
                  {{ csT("$form.steps.2") }}
                </span>
              </div>

              <!-- Divider -->
              <div class="hidden lg:block flex-1 mx-2 h-px" :class="currentStep >= 3 ? 'bg-yellow-400' : 'bg-gray-300'"></div>

              <!-- Step 3 -->
              <div class="flex items-center space-x-2 lg:flex-1 lg:justify-center">
                <span :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300',
                  currentStep >= 3
                    ? 'bg-yellow-400 text-gray-700 border-yellow-400'
                    : 'bg-white text-gray-500 border-gray-300',
                ]">
                  3
                </span>
                <span class="text-nowrap" :class="currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'">
                  {{ csT("$form.steps.3") }}
                </span>
              </div>

              <!-- Divider -->
              <div class="hidden lg:block flex-1 mx-2 h-px" :class="currentStep >= 4 ? 'bg-yellow-400' : 'bg-gray-300'"></div>

              <!-- Step 4 -->
              <div class="flex items-center space-x-2 lg:flex-1">
                <span :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300',
                  currentStep >= 4
                    ? 'bg-yellow-400 text-gray-700 border-yellow-400'
                    : 'bg-white text-gray-500 border-gray-300',
                ]">
                  4
                </span>
                <span class="text-nowrap" :class="currentStep >= 4 ? 'text-gray-900' : 'text-gray-500'">
                  {{ csT("$form.steps.4") }}
                </span>
              </div>

              <!-- Divider -->
              <div class="hidden lg:block flex-1 mx-2 h-px" :class="currentStep >= 5 ? 'bg-yellow-400' : 'bg-gray-300'"></div>

              <!-- Step 5 -->
              <div class="flex items-center space-x-2 lg:flex-1 lg:justify-end">
                <span :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full border transition-all duration-300',
                  currentStep >= 5
                    ? 'bg-yellow-400 text-gray-700 border-yellow-400'
                    : 'bg-white text-gray-500 border-gray-300',
                ]">
                  5
                </span>
                <span class="text-nowrap" :class="currentStep >= 5 ? 'text-gray-900' : 'text-gray-500'">
                  {{ csT("$form.steps.5") }}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <!-- Progress Bar -->
          <div v-if="isSubmitting" class="w-full h-0.5 overflow-hidden mb-4">
            <div class="h-full bg-yellow-500 animate-loading"></div>
          </div>
        <CardContent>
          <LocationSelection v-if="currentStep === 1" ref="step1Ref" v-model:form-data="formData.step1"
            :errors="errors.step1" @location-selected="handleLocationSelected" />

          <ReportInformation v-if="currentStep === 2" ref="step2Ref" v-model:form-data="formData.step2"
            :errors="errors.step2" />

          <VehicleInformation v-if="currentStep === 3" ref="step3Ref" v-model:form-data="formData.step3"
            :errors="errors.step3" />

          <DamageDetails v-if="currentStep === 4" ref="step4Ref" v-model:form-data="formData.step4"
            :errors="errors.step4" />

          <ContactInformation v-if="currentStep === 5" ref="step5Ref" v-model:form-data="formData.step5"
            :errors="errors.step5" />

          <div class="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-2 sm:gap-0">
            <Button v-if="currentStep > 1" variant="outline" @click="goToPreviousStep" type="button"
              class="font-poppins text-sm sm:text-base px-3 sm:px-4">
              {{ csT("$form.actions.back") }}
            </Button>
            <div v-else></div>

            <Button v-if="currentStep < 5" @click="goToNextStep" type="button" variant="primary"
              class="font-poppins text-sm sm:text-base px-3 sm:px-4 transition-transform duration-300 hover:scale-105">
              {{ csT("$form.actions.next") }}
            </Button>

            <Button v-if="currentStep === 5" @click="submitForm" type="button" variant="primary"
              :disabled="isSubmitting"
              class="font-poppins text-sm sm:text-base px-3 sm:px-4 transition-transform duration-300 hover:scale-105 disabled:hover:scale-100">
              {{
                isSubmitting
                  ? csT("$form.actions.submitting")
                  : csT("$form.actions.submit")
              }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <!-- Success Dialog -->
  <div v-if="isSuccessDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white border-2 border-yellow-400 shadow-2xl rounded-lg max-w-md w-full mx-2 sm:mx-4">
      <div class="py-4 sm:py-6 text-center px-4">
        <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p class="text-sm sm:text-base text-gray-600 font-poppins">
          {{ csT("$form.actions.success") }}
        </p>
      </div>
      <div class="pt-4 pb-6 px-4 sm:p-6">
        <Button variant="primary" @click="onSuccessOkay"
          class="w-full bg-animated-gradient text-white font-bold p-2 sm:p-3 text-sm sm:text-base font-poppins">
          OK
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LocationSelection,
  ReportInformation,
  VehicleInformation,
  DamageDetails,
  ContactInformation,
} from "./three_sections";
import type { UserLocation } from "~/components/appointment/location-selection";
import { useState, navigateTo } from "#app";

const currentStep = ref(1);
const isSubmitting = ref(false);
const isSuccessDialogOpen = ref(false);
const currentLocation = useState("userLocation", (): UserLocation | undefined => undefined) as Ref<UserLocation | undefined>;
const { t: csT } = useMessages("case-submit");

const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();
const step4Ref = ref();
const step5Ref = ref();

const formData = reactive({
  step1: {
    location: undefined as UserLocation | undefined,
  },
  step2: {
    reportType: "",
    zuordnung: "",
  },
  step3: {
    vehicleMakeModel: "",
    mileage: "",
    previousDamage: "",
    manufYear: "",
  },
  step4: {
    detailedInformation: "",
    uploadedFiles: [] as File[],
  },
  step5: {
    fullName: "",
    lon: currentLocation?.value?.lng || 0,
    lat: currentLocation?.value?.lat || 0,
    email: "",
    mobile: "",
    onWhatsapp: null as boolean | null,
    locationName: currentLocation?.value?.name || "",
    dataSharingConsent: false,
  },
});

const errors = reactive({
  step1: {} as Record<string, string>,
  step2: {} as Record<string, string>,
  step3: {} as Record<string, string>,
  step4: {} as Record<string, string>,
  step5: {} as Record<string, string>,
});

const goToNextStep = async () => {
  const isValid = await validateCurrentStep();
  if (isValid && currentStep.value < 5) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const validateCurrentStep = async (): Promise<boolean> => {
  let isValid = true;

  await nextTick();

  if (currentStep.value === 1) {
    if (step1Ref.value) {
      isValid = step1Ref.value.validate();
      if (!isValid) {
        updateStep1Errors();
      } else {
        clearStep1Errors();
      }
    }
  } else if (currentStep.value === 2) {
    if (step2Ref.value) {
      isValid = step2Ref.value.validate();
      if (!isValid) {
        updateStep2Errors();
      } else {
        clearStep2Errors();
      }
    }
  } else if (currentStep.value === 3) {
    if (step3Ref.value) {
      isValid = step3Ref.value.validate();
      if (!isValid) {
        updateStep3Errors();
      } else {
        clearStep3Errors();
      }
    }
  } else if (currentStep.value === 4) {
    if (step4Ref.value) {
      isValid = step4Ref.value.validate();
      if (!isValid) {
        updateStep4Errors();
      } else {
        clearStep4Errors();
      }
    }
  } else if (currentStep.value === 5) {
    if (step5Ref.value) {
      isValid = step5Ref.value.validate();
      const newErrors: Record<string, string> = {};
      if (!formData.step5.fullName?.trim()) {
        newErrors.fullName = csT("$contact.fullName.required");
      }
      if (!formData.step5.mobile?.trim()) {
        newErrors.mobile = csT("$contact.mobile.required");
      } else if (!isValidGermanMobile(formData.step5.mobile)) {
        newErrors.mobile = csT("$contact.mobile.invalid");
      }
      if (formData.step5.onWhatsapp === false) {
        if (!formData.step5.email?.trim()) {
          newErrors.email = csT("$contact.email.required");
        } else if (!isValidEmail(formData.step5.email)) {
          newErrors.email = csT("$contact.email.invalid");
        }
      } else if (formData.step5.email?.trim() && !isValidEmail(formData.step5.email)) {
        newErrors.email = csT("$contact.email.invalid");
      }
      if (formData.step5.onWhatsapp === null) {
        newErrors.onWhatsapp = csT("$contact.whatsapp.required");
      }
      if (!formData.step5.dataSharingConsent) {
        newErrors.dataSharingConsent = csT("$contact.dataSharingConsent.required");
      }
      errors.step5 = newErrors;
      if (Object.keys(newErrors).length > 0) {
        isValid = false;
      }
    }
  }

  return isValid;
};

const updateStep1Errors = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.step1.location) {
    newErrors.location = csT("$location.required");
  }

  errors.step1 = newErrors;
};

const updateStep2Errors = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.step2.reportType) {
    newErrors.reportType = csT("$report.reportType.required");
  }

  // Validate Zuordnung field if required
  const shouldShowZuordnung = formData.step2.reportType === 'haftpflichtgutachten' || 
                              formData.step2.reportType === 'accident';
  if (shouldShowZuordnung && !formData.step2.zuordnung) {
    newErrors.zuordnung = csT("$report.zuordnung.required");
  }

  errors.step2 = newErrors;
};

const updateStep3Errors = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.step3.vehicleMakeModel?.trim()) {
    newErrors.vehicleMakeModel = csT("$vehicle.vehicleMakeModel.required");
  } else if (formData.step3.vehicleMakeModel.trim().length < 1) {
    newErrors.vehicleMakeModel = csT("$vehicle.vehicleMakeModel.minLength");
  }

  if (!formData.step3.mileage?.trim()) {
    newErrors.mileage = csT("$vehicle.mileage.required");
  } else if (!isValidMileage(formData.step3.mileage)) {
    newErrors.mileage = csT("$vehicle.mileage.invalid");
  }

  if (!formData.step3.previousDamage) {
    newErrors.previousDamage = csT("$vehicle.previousDamage.required");
  }

  if (formData.step3.manufYear?.toString().trim()) {
    if (!isValidYear(formData.step3.manufYear)) {
      newErrors.manufYear = csT("$vehicle.manufYear.invalid");
    }
  }

  errors.step3 = newErrors;
};

const updateStep4Errors = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.step4.detailedInformation?.trim()) {
    newErrors.detailedInformation = csT(
      "$details.detailedInformation.required"
    );
  }

  errors.step4 = newErrors;
};

const updateStep5Errors = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.step5.fullName?.trim()) {
    newErrors.fullName = csT("$contact.fullName.required");
  }

  if (formData.step5.onWhatsapp === false) {
    if (!formData.step5.email?.trim()) {
      newErrors.email = csT("$contact.email.required");
    } else if (!isValidEmail(formData.step5.email)) {
      newErrors.email = csT("$contact.email.invalid");
    }
  } else if (formData.step5.email?.trim() && !isValidEmail(formData.step5.email)) {
    newErrors.email = csT("$contact.email.invalid");
  }

  if (!formData.step5.mobile?.trim()) {
    newErrors.mobile = csT("$contact.mobile.required");
  } else if (!isValidGermanMobile(formData.step5.mobile)) {
    newErrors.mobile = csT("$contact.mobile.invalid");
  }

  if (formData.step5.onWhatsapp === null) {
    newErrors.onWhatsapp = csT("$contact.whatsapp.required");
  }

  if (!formData.step5.dataSharingConsent) {
    newErrors.dataSharingConsent = csT("$contact.dataSharingConsent.required");
  }

  errors.step5 = newErrors;
};

const clearStep1Errors = () => {
  errors.step1 = {};
};

const clearStep2Errors = () => {
  errors.step2 = {};
};

const clearStep3Errors = () => {
  errors.step3 = {};
};

const clearStep4Errors = () => {
  errors.step4 = {};
};

const clearStep5Errors = () => {
  errors.step5 = {};
};

const isValidMileage = (mileage: string): boolean => {
  const mileageRegex = /^\d+\s*(km|miles?)?$/i;
  return mileageRegex.test(mileage.trim());
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidGermanMobile = (mobile: string): boolean => {
  const digitsOnly = String(mobile || '').replace(/\D/g, '');
  let normalized = digitsOnly;
  if (normalized.startsWith('49')) {
    normalized = normalized.slice(2);
  }
  if (normalized.startsWith('0')) {
    normalized = normalized.slice(1);
  }
  const pattern = /^(?:1(?:5|6|7)\d{8,9})$/;
  return pattern.test(normalized);
};

const isValidYear = (year: string): boolean => {
  const yearNumber = Number(year);
  if (!Number.isInteger(yearNumber)) {
    return false;
  }
  const currentYear = new Date().getFullYear();
  return yearNumber >= 1900 && yearNumber <= currentYear;
};

// removed: formatToE164DE helper is no longer needed

async function filesToJson(files: File[]): Promise<Array<{ name: string; type: string; data: string }>> {
  const results: Array<{ name: string; type: string; data: string }> = [];
  for (const f of files) {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(f);
    });
    results.push({ name: f.name, type: f.type || "application/octet-stream", data });
  }
  return results;
}

const submitForm = async () => {
  const isValid = await validateCurrentStep();

  if (!isValid) {
    return;
  }

  isSubmitting.value = true;

  try {
    const selectedLocation = formData.step1.location;
    
    formData.step5.lat = selectedLocation?.lat || 0;
    formData.step5.lon = selectedLocation?.lng || 0;
    formData.step5.locationName = selectedLocation?.name || "";

    const uploadedFiles = await filesToJson(formData.step4.uploadedFiles || []);

    const formPayload = {
      step1: {
        location: formData.step1.location,
      },
      step2: {
        reportType: formData.step2.reportType,
        zuordnung: formData.step2.zuordnung,
      },
      step3: {
        vehicleMakeModel: formData.step3.vehicleMakeModel,
        mileage: formData.step3.mileage,
        previousDamage: formData.step3.previousDamage,
      manufYear: formData.step3.manufYear,
      },
      step4: {
        detailedInformation: formData.step4.detailedInformation,
        uploadedFiles,
      },
      step5: {
        fullName: formData.step5.fullName,
        email: formData.step5.email,
        mobile: formData.step5.mobile,
        onWhatsapp: formData.step5.onWhatsapp,
        lat: formData.step5.lat,
        lon: formData.step5.lon,
        locationName: formData.step5.locationName,
      },
    };

    if(formData.step4.uploadedFiles.length >= 1) {
      const supabase = useSupabaseClient();
      await supabase.auth.signOut()
    }

    const res = await $fetch("/api/report", {
      method: "POST",
      body: formPayload,
    });
    if (!(res as any)?.success) throw new Error((res as any)?.message || "Submission failed");

    formData.step1.location = undefined;
    formData.step2.reportType = "";
    formData.step2.zuordnung = "";
    formData.step3.vehicleMakeModel = "";
    formData.step3.mileage = "";
    formData.step3.previousDamage = "";
    formData.step3.manufYear = "";
    formData.step4.detailedInformation = "";
    formData.step4.uploadedFiles = [];
    formData.step5.fullName = "";
    formData.step5.email = "";
    formData.step5.mobile = "";
    formData.step5.onWhatsapp = null;
    formData.step5.lat = currentLocation?.value?.lat || 0;
    formData.step5.lon = currentLocation?.value?.lng || 0;
    formData.step5.locationName = currentLocation?.value?.name || "";
    formData.step5.dataSharingConsent = false;
    
    currentStep.value = 1;
    
    isSuccessDialogOpen.value = true;
  } catch (error: any) {
    console.error("Error submitting form:", error);
    const message = error?.data?.message || error?.message || csT("$form.actions.error");
    if (message && /mobile|number/i.test(message)) {
      errors.step5 = { ...errors.step5, mobile: csT("$contact.mobile.invalid") };
    }
  } finally {
    isSubmitting.value = false;
  }
};

const emit = defineEmits<{
  'location-selected': [location: UserLocation]
}>()

const handleLocationSelected = (location: UserLocation) => {  
  formData.step1.location = location
  
    emit('location-selected', location)
  
  setTimeout(() => {
    if (currentStep.value === 1) {
      currentStep.value = 2;
    }
  }, 1000);
};

const onSuccessOkay = () => {
  isSuccessDialogOpen.value = false;
  navigateTo("/");
};
</script>

<style scoped lang="postcss">
.bg-animated-gradient {
  background: linear-gradient(45deg, #e6b606, #ffd505, #cc9b0a);
  background-size: 200% 200%;
  animation: gradientAnimation 3s ease infinite alternate;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}

/* Enhanced form styling */
:deep(.select-trigger) {
  @apply border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400;
}

:deep(.select-content) {
  @apply border-yellow-200 bg-white;
}

:deep(.select-item) {
  @apply hover:bg-yellow-50 focus:bg-yellow-50;
}

/* Input focus styling */
:deep(input:focus),
:deep(textarea:focus) {
  @apply border-yellow-400 ring-yellow-400;
}


@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-loading {
  width: 100%;
  animation: loading 1.5s infinite;
}
</style>
