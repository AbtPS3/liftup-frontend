<template>
  <div class="input-group input-mid">
    <input type="submit" :value="value" :class="[type]">
  </div>
</template>

<script setup>
const props = defineProps(["value", "type"]);
</script>

<style scoped>
.input-btn {
  position: relative;
  margin-top: 10%;
  cursor: pointer;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #c3c3c3;
  color: #666;
  font-size: 1.1em;
  margin-top: 30px;
  min-width: 140px;
}

.input-btn:first-of-type {
  margin-right: 30px;
}

.input-btn:last-of-type {
  margin-left: 30px;
}

.btn-primary {
  color: white;
  background-color: var(--color-success-mute);
}

.btn-primary:hover {
  background-color: var(--color-success-soft);
}

.btn-danger {
  color: white;
  background-color: var(--color-error-norm);
}

.btn-danger:hover {
  background-color: var(--color-error-soft);
}
</style>