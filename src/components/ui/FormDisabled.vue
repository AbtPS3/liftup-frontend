<template>
  <div class="input-group input-mid">
    <label :for="field">{{ label }}</label>
    <input :type="type" class="input-text large-text" :id="field" :name="field" :value="value" disabled>
  </div>
</template>

<script setup>
const props = defineProps(["type", "label", "field", "value"]);
</script>

<style scoped>
input {
  color: var(--color-text-soft);
}
</style>