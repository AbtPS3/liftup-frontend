<template>
  <div class="input-group input-mid">
    <label for="username">{{ label }}</label>
    <input :type="type" class="input-text large-text" :id="field" :name="field" autocomplete="on"
      @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script setup>
const props = defineProps(["type", "label", "field", "modelValue"]);
</script>