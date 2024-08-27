<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  userUploadStats: {
    type: Object,
    required: true,
    default: () => ({
      clientFiles: 0,
      contactFiles: 0,
      resultFiles: 0,
      acceptedRecords: 0,
      rejectedRecords: 0,
      lastUploadDate: ''
    })
  }
});
</script>

<template>
  <div class="user-stats">
    <div class="top-spacer"></div>
    <div class="bottom-content">
      <p>Client Files Uploaded: {{ userUploadStats.clientFiles }}</p>
      <p>Contact Files Uploaded: {{ userUploadStats.contactFiles }}</p>
      <p>Results Files Uploaded: {{ userUploadStats.resultFiles }}</p>
      <p>Total Accepted Records: {{ userUploadStats.acceptedRecords }}</p>
      <p>Total Rejected Records: {{ userUploadStats.rejectedRecords }}</p>
      <p>Last Upload Date: {{ new Date(userUploadStats.lastUploadDate).toLocaleString() }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-stats {
  position: relative;
  height: 100%;
  width: fit-content;
  display: flex;
  justify-content: space-between;
}

.top-spacer {
  height: 150px;
}

.bottom-content {
  position: relative;
  margin-top: 100px;
  text-align: left;
}
</style>
