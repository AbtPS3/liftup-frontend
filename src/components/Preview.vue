<template>
  <div class="preview" @click="usePreview.toggleVisibility(false)">
    <div class="preview-cover">
      <IndexTable />
    </div>
  </div>
</template>

<script setup>

import { usePreview } from '../stores/store';

import IndexTable from './ui/IndexTable.vue';

// const props = defineProps(["header", "rows"]);

</script>

<style scoped></style>