<template>
  <div class="alert" @click="useAlert.toggleVisibility(false)">
    <div class="alert-cover">
      <div class="alert-box" :class="[type]">
        <strong>{{ title }}:&nbsp;</strong> {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>

import { useAlert } from '../stores/store';

const props = defineProps(["title", "message", "type"]);

</script>

<style scoped></style>