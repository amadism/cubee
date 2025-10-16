<script>
export default {
  name: 'ReturnButton',
  props: {
    label: {
      type: String,
      default: 'Return',
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<template>
  <button class="button-style" @click="onClick">
    <span class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="icon-size"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </span>
    <span class="label uppercase">{{ label }}</span>
  </button>
</template>

<style scoped>
.button-style {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2.5rem 0;
  padding: 0.5rem 4rem;
  background-color: #f3f3f3;
  /* Light gray background */
  border-radius: 0.75rem;
  color: #505050;
  /* Dark gray text */
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-style:hover {
  background-color: #e2e2e2;
  /* Slightly darker gray on hover */
}

.icon-size {
  width: 1rem;
  height: 1rem;
}

.label {
  font-size: 1.125rem;
  /* Equivalent to text-lg in Tailwind */
}

.icon {
  margin-right: 0.5rem;
}
</style>
