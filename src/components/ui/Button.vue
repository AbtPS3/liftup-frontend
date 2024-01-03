<template>
  <input type="button" :class="[type]" :value="value">
</template>

<script setup>

const props = defineProps(["type", "value"]);

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

.btn-primary {
  color: #083b12;
  background-color: #d9eddb;
}

.btn-primary:hover {
  background-color: #a3cea7;
}

.btn-danger {
  color: #ae2b2b;
  background-color: #ead1d1;
}

.btn-danger:hover {
  background-color: #d9b3b3;
}
</style>