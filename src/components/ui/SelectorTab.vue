<template>
  <div class="selector-tab">
    <div class="selector-tab-left"
      :class="{ 'tab-selected-left': selectedMode === 'clients' }, { 'tab-unselected-left': selectedMode === 'contacts' }"
      @click="selectMode('clients')">{{ $t('shared.link.clients') }}</div>
    <div class="selector-tab-right"
      :class="{ 'tab-selected-right': selectedMode === 'contacts' }, { 'tab-unselected-right': selectedMode === 'clients' }"
      @click="selectMode('contacts')">{{ $t('shared.link.contacts') }}</div>
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
.selector-tab {
  position: absolute;
  top: 0;
  width: 18%;
  max-width: 250px;
  min-width: 150px;
  height: 4%;
  max-height: 50px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--color-background-mute);
  box-shadow: 2px 2px 2px var(--color-box-shadow);
  border-radius: 0 0 20px 20px;
}

.selector-tab-left,
.selector-tab-right {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.selector-tab-left:hover,
.selector-tab-right:hover {
  /* background-color: var(--color-background-soft); */
  text-decoration: underline;
  cursor: pointer;
}

.selector-tab-left {
  background-color: var(--color-tab-left);
  border-radius: 0 0 0 20px;
}

.selector-tab-right {
  background-color: var(--color-tab-right);
  border-radius: 0 0 20px 0;
}

.tab-selected-left {
  z-index: 1;
}

.tab-selected-right {
  z-index: 1;
}

.tab-unselected-left {
  box-shadow: 2px 2px 2px var(--color-box-shadow);
  /* z-index: 2; */
}

.tab-unselected-right {
  box-shadow: -2px 2px 2px var(--color-box-shadow);
  /* z-index: 2; */
}
</style>