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
        <p class="upload-title">
          {{ isFileUploaded ? uploadTitle : 'Upload a File!' }}
        </p>
        <p class="upload-details" v-if="isDragging">Release to upload!</p>
        <p class="upload-details" v-else>
          {{ isFileUploaded ? uploadMessage : 'Drop your file here!' }}
        </p>
        <input type="file" class="csv-file" tabindex="-1" ref="fileInput" @change="handleFileChange" accept="csv" />
      </div>
    </div>
    <div class="input-group input-mid">
      <input type="button" class="input-btn large-text" value="Upload CSV File" @click="uploadButtonClick">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";

import { useToken } from '../stores/store';
import { jwtDecode } from "jwt-decode";
import { useAlert } from "@/stores/store"

const token = useToken.token;
const decodedJwt = jwtDecode(token);
const facilityName = decodedJwt.data.facility;
const userName = decodedJwt.data.providerId;

const isDragging = ref(false);
const isFileUploaded = ref(false);
const fileInput = ref(null);
const uploadMessage = ref(null);
const uploadTitle = ref(null);

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    isFileUploaded.value = true;
    for (const file of files) {
      isFileUploaded.value = true;
      uploadMessage.value = "Click the button below to upload."
      uploadTitle.value = file.name
      if (files.length > 0) {
        if (files[0].type != "text/csv") {
          isFileUploaded.value = false;
          fileInput.value = null;
          useAlert.toggleVisibility(true);
          useAlert.changeType("alert-error");
          useAlert.changeTitle("ERROR");
          useAlert.changeMessage("Only CSV files allowed!");
          setTimeout(() => {
            useAlert.toggleVisibility(false);
          }, 5000);
        } else if (files[0].size > import.meta.env.VITE_MAX_FILE_SIZE) {
          isFileUploaded.value = false;
          fileInput.value = null;
          useAlert.toggleVisibility(true);
          useAlert.changeType("alert-error");
          useAlert.changeTitle("ERROR");
          useAlert.changeMessage("CSV file-size limit reached!");
          setTimeout(() => {
            useAlert.toggleVisibility(false);
          }, 5000);
        }
      }

    }

  }
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleFileChange = (event) => {
  const files = event.target.files;
  for (const file of files) {
    if (files.length > 0) {
      isFileUploaded.value = true;
      uploadMessage.value = "Click the button below to upload."
      uploadTitle.value = file.name
      if (files[0].type != "text/csv") {
        isFileUploaded.value = false;
        fileInput.value = null;
        useAlert.toggleVisibility(true);
        useAlert.changeType("alert-error");
        useAlert.changeTitle("ERROR");
        useAlert.changeMessage("Only CSV files allowed!");
        setTimeout(() => {
          useAlert.toggleVisibility(false);
        }, 5000);
      } else if (files[0].size > import.meta.env.VITE_MAX_FILE_SIZE) {
        isFileUploaded.value = false;
        fileInput.value = null;
        useAlert.toggleVisibility(true);
        useAlert.changeType("alert-error");
        useAlert.changeTitle("ERROR");
        useAlert.changeMessage("CSV file-size limit reached!");
        setTimeout(() => {
          useAlert.toggleVisibility(false);
        }, 5000);
      }
    }
  }
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const backendPort = import.meta.env.VITE_BACKEND_PORT;
    const backendAddress = `${backendUrl}:${backendPort}/api/v1/uploads`;

    console.log('Token:', useToken.token); // Log the token for debugging

    const response = await axios.post(backendAddress, formData, {
      headers: { Authorization: `Bearer ${useToken.token}` },
    });

    console.log('Response:', response.data);
    isFileUploaded.value = false;
    return true;
  } catch (error) {
    console.error('Error during file upload:', error);
    return false;
  }
};

// Function to handle the button click and trigger the file upload
const uploadButtonClick = () => {
  // Upload the file when the button is clicked
  if (fileInput.value.files.length > 0) {
    isFileUploaded.value = false;
    // uploadMessage.value = "Click the button below to upload."
    // uploadTitle.value = file.name
    uploadFile(fileInput.value.files[0]);
  }
};

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

.input-btn {
  position: relative;
  margin-top: 10%;
  cursor: pointer;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #c3c3c3;
  color: #666;
}

.input-btn:hover {
  background-color: #fff;
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