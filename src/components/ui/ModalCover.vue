<template>
  <!-- <div class="alert" @click="useModal.toggleVisibility(false)"> -->
  <div class="alert"> <!-- remove and uncomment the above -->
    <div class="alert-cover">
      <div class="modal-box">
        <span class="modal-title">{{ title }}</span>
        <span class="modal-message">{{ message }}</span>
        <span class="modal-link" @click="downloadBlob"><a>Download</a></span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useModal } from '@/stores/state';

const props = defineProps(["title", "message"]);

const downloadBlob = () => {
  const blob = useModal.data; // Retrieve the blob data from the store
  const url = window.URL.createObjectURL(blob); // Create a URL for the blob
  const link = document.createElement('a'); // Create a link element
  link.href = url;
  link.setAttribute('download', 'rejected_records.csv'); // Set the download attribute
  document.body.appendChild(link); // Append the link to the document
  link.click(); // Simulate a click to trigger the download
  document.body.removeChild(link); // Remove the link element from the document
  window.URL.revokeObjectURL(url); // Release the object URL
  useModal.toggleVisibility(false)
};


</script>

<style scoped>
.modal-box {
  position: absolute;
  background-color: var(--color-alert-warning);
  color: white;
  top: 5vh;
  right: 5vw;
  height: 100px;
  width: 400px;
  min-height: 70px;
  min-width: 250px;
  font-size: 1.1em;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 4;
  padding: 0 10px 0 10px;
  text-align: center;
}

.modal-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.model-message {
  font-size: 1em;
  text-align: center;
}

.modal-link {
  font-size: 1.1em;
  text-decoration: none;
  margin-top: 20px;
}

.modal-link a {
  color: rgb(255, 255, 255);
  color: blue;
  /* font-weight: bold; */
}

.modal-link a:hover {
  color: rgb(230, 230, 230);
  transition: 300ms;
}
</style>
