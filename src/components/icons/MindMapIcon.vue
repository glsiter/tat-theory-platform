<template>
  <TatIcon v-bind="$attrs">
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.618v10.764a1 1 0 01-.553.894L15 18l-6-3z"
    />
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 2v18"
    />
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 5v18"
    />
  </TatIcon>
</template>

<script setup lang="ts">
import TatIcon from './TatIcon.vue'
</script>