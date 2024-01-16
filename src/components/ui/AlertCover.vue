<template>
  <div class="alert" @click="useAlert.toggleVisibility(false)">
    <div class="alert-cover">
      <div class="alert-box" :class="[type]">
        <span class="alert-title">{{ title }}</span>
        <span class="alert-message">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useAlert } from '@/stores/state';

const props = defineProps(["title", "message", "type"]);

</script>

<style scoped></style>
