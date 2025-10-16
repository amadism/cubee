<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<
  DialogContentProps & {
    class?: HTMLAttributes['class']
  }
>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 grid content-end justify-items-center bg-black/80 md:content-normal"
    >
      <DialogContent
        :class="
          cn(
            'border-border bg-background relative z-50 grid max-h-[100dvh] w-full gap-4 border shadow-lg duration-200 sm:rounded-lg md:w-full md:max-w-lg md:place-self-center',
            props.class,
          )
        "
        v-bind="forwarded"
      >
        <div class="flex h-full max-h-[100dvh] flex-col gap-4 p-5">
          <div class="flex-1 overflow-y-auto overscroll-contain">
            <slot />
          </div>

          <slot name="footer" />

          <DialogClose
            class="hover:bg-secondary absolute right-4 top-4 rounded-md p-0.5 transition-colors"
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
