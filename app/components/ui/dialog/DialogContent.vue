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
import { faCross } from '@fortawesome/pro-solid-svg-icons'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes['class']
      attach?: 'bottom'
      closeable?: boolean
      animateIn?: boolean
    }
  >(),
  {
    closeable: true,
    animateIn: true,
  },
)

const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { attach, closeable, animateIn, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const attachClasses = {
  '': 'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
  bottom:
    'data-[state=open]:slide-in-from-bottom-[48%] data-[state=closed]:slide-out-to-bottom-[48%] bottom-0 top-auto max-h-screen translate-y-0 overflow-y-auto overscroll-contain',
} as const

const attachClass = computed(() => attachClasses[props.attach ?? ''])
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/80"
      :class="
        animateIn
          ? 'data-[state=open]:animate-in data-[state=open]:fade-in-0'
          : ''
      "
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:zoom-out-95 fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border shadow-lg duration-200 sm:rounded-lg',
          animateIn
            ? 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2'
            : '',
          attachClass,
          props.class,
        )
      "
    >
      <slot />

      <DialogClose
        v-if="closeable"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
      >
        <Icon :icon="faCross" class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
