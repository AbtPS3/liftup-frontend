<template>
  <div class="mode-selector">
    <a class="selector-link" :class="{ 'left-tab selected': selectedMode === 'clients' }" @click="selectMode('clients')">
      {{ $t('shared.link.clients') }}
    </a>
    <a class="selector-link" :class="{ 'right-tab selected': selectedMode === 'contacts' }"
      @click="selectMode('contacts')">
      {{ $t('shared.link.contacts') }}
    </a>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMode } from "@/stores/state";

const selectedMode = ref(useMode.mode);
const selectMode = (mode) => {
  selectedMode.value = mode;
  useMode.changeMode(mode);
};

</script>

<style scoped>
.mode-selector {
  position: relative;
  width: 100%;
  height: 40px;
  /* background-color: var(--color-background); */
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.selector-link {
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid var(--color-background-mute); */
}

.mode-selector:has(selector-link:hover) .left-tab {
  background: black;
  font-weight: bold;
}

.selector-link:hover,
.selector-link:visited {
  /* background-color: var(--color-background-mute); */
  border-bottom: 2px solid var(--color-success-norm);
}

.selected {
  /* background-color: var(--color-background-mute); */
  border-bottom: 2px solid var(--color-success-norm);
}
</style>