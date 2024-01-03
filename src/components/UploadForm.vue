<template>
  <div class="form-group">
    <div class="input-group input-mid">
      <label for="facility_name">Facility Name</label>
      <input v-model="facilityName" class="input-text" type="text" name="facility_name" id="facility_name" disabled>
    </div>
    <div class="input-group input-mid">
      <label for="provider_id">Provider ID</label>
      <input v-model="userName" class="input-text" type="text" name="provider_id" id="provider_id" disabled>
    </div>
    <div class="input-group input-group-tall">
      <div class="upload-area" tabindex="0" @dragover.prevent @drop="handleDrop" @dragleave="handleDragLeave">
        <img class="small-icon" src="@/assets/upload-icon.png" alt="Upload Icon">
        <p class="upload-title">{{ fileTitle }}</p>
        <p class="upload-details">{{ fileMessage }}</p>
        <input type="file" class="csv-file" tabindex="-1" ref="fileInput" @change="handleFileChange" accept="csv" />
      </div>
    </div>
    <div class="input-group input-mid">
      <Button v-if="fileStatus == true" :class="'input-btn large-text'" :value="'Preview File'"
        @click="usePreview.toggleVisibility(true)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import Papa from "papaparse";
import { useToken, usePreview, useFileStatus } from "../stores/store";
import showAlert from "./scripts/showAlerts";
import arraysEqual from "./scripts/arrayEquals";
import Button from "./ui/Button.vue";

const token = useToken.token;
const decodedJwt = jwtDecode(token);
const facilityName = decodedJwt.data.facility;
const userName = decodedJwt.data.providerId;

const isDragging = ref(false);
const fileInput = ref(null);
const fileStatus = computed(() => useFileStatus.value);
const fileTitle = computed(() => useFileStatus.title);
const fileMessage = computed(() => useFileStatus.message);
const csvData = ref(null);

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer.files;
  processCsv(files)

  if (isDragging.value) {
    fileMessage.value = "Release to upload!";
  }
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleFileChange = async (event) => {
  const files = event.target.files;
  processCsv(files)
};

function processCsv(files) {
  for (const file of files) {
    if (files.length > 0) {
      useFileStatus.toggleValue(true, file.name, "Click 'Preview File' to preview!");
      if (files[0].type != "text/csv") {
        useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
        fileInput.value = null;
        showAlert("alert-error", "ERROR", "Only CSV files allowed!");
      } else if (files[0].size > import.meta.env.VITE_MAX_FILE_SIZE) {
        useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
        fileInput.value = null;
        showAlert("alert-error", "ERROR", "CSV file-size limit reached!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          Papa.parse(reader.result, {
            complete: (result) => {
              csvData.value = result.data;
              const rawCsvData = csvData._rawValue;
              const expectedHeaders = import.meta.env.VITE_CSV_HEADERS.split(",");
              if (!arraysEqual(rawCsvData[0], expectedHeaders)) {
                useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
                fileInput.value = null;
                showAlert("alert-error", "ERROR", "File headings are not valid!");
              } else {
                usePreview.setCsvData(rawCsvData[0], rawCsvData.slice(1))
              }
            },
          });
        };
        reader.readAsText(file);
      }
    }
  }
}
</script>

<style scoped>
.form-group {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}

.input-mid {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-top: 5%;
}

.input-group-tall {
  position: relative;
  display: flex;
  width: 80%;
  margin-top: 5%;
}

.input-group label {
  font-size: 0.9em;
  color: #999;
  padding: 0 0 5px 10px;
}

.input-group input {
  height: 40px;
  border-radius: 5px;
  border: 1px solid #c3c3c3;
  font-size: 0.9em;
  padding: 0 10px 0 10px;
}

.input-group .large-text {
  font-size: 1.2em;
}

.input-group input:focus {
  border: 1px solid #989898;
  outline: none !important;
  color: #333;
  font-size: 1.2em;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 5px;
  background-color: #eaeaea;
  text-align: center;
  cursor: pointer;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.upload-area:hover {
  border-color: #4CAF50;
}

.upload-area input {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: #666;
}

.upload-area .upload-title {
  font-weight: bold;
  font-size: 1.2em;
}

.upload-area .upload-details {
  font-size: 1.1em;
}

.upload-area .small-icon {
  height: 32px;
  width: 32px;
  padding-top: 10px;
}
</style>