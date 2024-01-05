<template>
  <div class="table-container">
    <table>
      <!-- <tr class="table-header">
        <th class="left-cell">SN</th>
        <td v-for="header in headers" :key="header">{{ header }}</td>
      </tr> -->
      <tr class="table-header">
        <th class="left-cell">SN</th>
        <td>CTC Number</td>
        <td>First Name</td>
        <td>Midle Name</td>
        <td>Surname</td>
        <td>Date of Birth</td>
        <td>Gender</td>
        <td>Map Cue</td>
        <td>Hamlet/Street</td>
        <td>Mobile Number</td>
        <td>Caretaker Name</td>
        <td>Caretaker Mobile</td>
      </tr>
      <tr v-for="(row, index) in rows" :key="row">
        <th class="left-cell"><span v-if="index < rows.length">{{ index + 1 }}</span></th>
        <td v-for="item in row">{{ item }}</td>
      </tr>
    </table>
  </div>
  <div class="action-buttons">
    <Button :type="'input-btn btn-primary'" :value="'Upload This File'" @click="uploadButtonClick" />
    <Button :type="'input-btn btn-danger'" :value="'Cancel Upload'" @click="handleUploadCancel" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useToken, usePreview, useFileStatus, useFileInput, useLoading } from '../../stores/store';
import Button from './Button.vue';
import showAlert from '../scripts/showAlerts';
import Papa from 'papaparse';
import axios from 'axios';

const csvData = usePreview.getCsvData();
const rows = csvData.rows;
const headers = csvData.headers;
const token = useToken.token;

onMounted(() => { });

const handleUploadCancel = () => {
  usePreview.removeCsvData();
  useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
  useFileInput.toggleValue(null);
  showAlert("alert-info", "INFO", "File upload/preview cancelled!");
}

const uploadButtonClick = () => {
  useLoading.toggleVisibility(true);
  useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
  uploadFile(headers, rows);
};

const uploadFile = async (headers, rows) => {
  const csvString = Papa.unparse([headers, ...rows]);
  const blob = new Blob([csvString], { type: 'text/csv' });

  const formData = new FormData();
  formData.append('file', blob, 'filename.csv');

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const backendPort = import.meta.env.VITE_BACKEND_PORT;
    const backendAddress = `${backendUrl}:${backendPort}/api/v1/uploads`;

    const response = await axios.post(backendAddress, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    useFileStatus.toggleValue(false, "Upload a file", "Click or Drop your file here!");
    useLoading.toggleVisibility(false);
    showAlert("alert-success", "SUCCESS", response.data.payload.message);
    return true;
  } catch (error) {
    console.error('Error during file upload:', error);
    showAlert("alert-error", "ERROR", error.message);
    return false;
  }
};

</script>

<style scoped>
.table-container {
  max-height: 75%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}

table {
  font-weight: normal;
  font-size: 0.9em;
  background-color: rgba(250, 250, 250, 0.75);
  border: 1px solid black;
  border-collapse: collapse;
  color: #333;
  min-width: fit-content;
  min-height: fit-content;
  width: 75%;
}

.table-header {
  height: 45px;
  color: #e6e6e6;
  background-color: rgba(15, 104, 37, 0.7);
  font-size: 1.1em;
  font-weight: bolder;
}

td {
  padding: 8px;
  max-width: 150px;
  height: 30px;
}

th {
  padding: 0 8px 0 8px;
}

tr,
th,
td {
  border: 1px solid #666;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  min-width: 30%;
}
</style>