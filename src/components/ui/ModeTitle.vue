<template>
  <div class="mode-title">

    <h1 v-if="selectedMode === 'clients'">
      {{ $t('shared.link.clients') }}
    </h1>

    <h1 v-else>
      {{ $t('shared.link.contacts') }}
    </h1>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMode } from "@/stores/state";

const selectedMode = computed(() => useMode.mode);
</script>

<style scoped>
.mode-title {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 1.6rem;
  color: var(--color-heading-green);
  font-weight: bold;
}
</style>