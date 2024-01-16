<template>
  <div class="preview" @click="usePreview.toggleVisibility(false)">
    <div class="preview-cover">
      <IndexTable />
    </div>
  </div>
</template>

<script setup>

import { usePreview } from '@/stores/state';

import IndexTable from '@/components/ui/IndexTable.vue';

</script>
