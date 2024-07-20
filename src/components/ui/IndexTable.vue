<template>
  <div class="table-container">
    <table>
      <!-- Uncomment the next TR kama unataka kutumia dynamic headers kutoka kwenye .env -->
      <!-- <tr class="table-header">
        <th class="left-cell">SN</th>
        <td v-for="header in headers" :key="header">{{ header }}</td>
      </tr> -->
      <tr v-if="mode == 'clients'" class="table-header">
        <th class="left-cell">{{ t('indexTable.headings.heading1') }}</th>
        <td>{{ t('indexTable.headings.heading2') }}</td>
        <td>{{ t('indexTable.headings.heading3') }}</td>
        <td>{{ t('indexTable.headings.heading4') }}</td>
        <td>{{ t('indexTable.headings.heading5') }}</td>
        <td>{{ t('indexTable.headings.heading6') }}</td>
        <td>{{ t('indexTable.headings.heading7') }}</td>
        <td>{{ t('indexTable.headings.heading8') }}</td>
        <td>{{ t('indexTable.headings.heading9') }}</td>
        <td>{{ t('indexTable.headings.heading10') }}</td>
        <td>{{ t('indexTable.headings.heading11') }}</td>
        <td>{{ t('indexTable.headings.heading12') }}</td>
      </tr>
      <tr v-if="mode == 'contacts'" class="table-header">
        <th class="left-cell">{{ t('indexTable.headings.heading1') }}</th>
        <td>{{ t('indexTable.headings.heading3') }}</td>
        <td>{{ t('indexTable.headings.heading4') }}</td>
        <td>{{ t('indexTable.headings.heading5') }}</td>
        <td>{{ t('indexTable.headings.heading6') }}</td>
        <td>{{ t('indexTable.headings.heading7') }}</td>
        <td>{{ t('indexTable.headings.heading8') }}</td>
        <td>{{ t('indexTable.headings.heading9') }}</td>
        <td>{{ t('indexTable.headings.heading10') }}</td>
        <td>{{ t('indexTable.headings.heading11') }}</td>
        <td>{{ t('indexTable.headings.heading12') }}</td>
        <td>{{ t('indexTable.headings.heading13') }}</td>
        <td>{{ t('indexTable.headings.heading14') }}</td>
        <td>{{ t('indexTable.headings.heading15') }}</td>
        <td>{{ t('indexTable.headings.heading16') }}</td>
      </tr>
      <tr v-if="mode == 'results'" class="table-header">
        <th class="left-cell">{{ t('indexTable.headings.heading1') }}</th>
        <td>{{ t('indexTable.headings.heading3') }}</td>
        <td>{{ t('indexTable.headings.heading4') }}</td>
        <td>{{ t('indexTable.headings.heading5') }}</td>
        <td>{{ t('indexTable.headings.heading6') }}</td>
        <td>{{ t('indexTable.headings.heading7') }}</td>
        <td>{{ t('indexTable.headings.heading8') }}</td>
        <td>{{ t('indexTable.headings.heading9') }}</td>
        <td>{{ t('indexTable.headings.heading10') }}</td>
        <td>{{ t('indexTable.headings.heading11') }}</td>
        <td>{{ t('indexTable.headings.heading12') }}</td>
        <td>{{ t('indexTable.headings.heading13') }}</td>
        <td>{{ t('indexTable.headings.heading14') }}</td>
        <td>{{ t('indexTable.headings.heading15') }}</td>
        <td>{{ t('indexTable.headings.heading16') }}</td>
        <td>{{ t('indexTable.headings.heading17') }}</td>
        <td>{{ t('indexTable.headings.heading18') }}</td>
        <td>{{ t('indexTable.headings.heading19') }}</td>
        <td>{{ t('indexTable.headings.heading20') }}</td>
        <td>{{ t('indexTable.headings.heading21') }}</td>
        <td>{{ t('indexTable.headings.heading22') }}</td>
      </tr>
      <tr v-for="(row, index) in nonEmptyRows" :key="row">
        <th class="left-cell"><span v-if="index < rows.length">{{ index + 1 }}</span></th>
        <td v-for="item in row">{{ item }}</td>
      </tr>
    </table>
  </div>
  <div class="action-buttons">
    <FormButton :type="'input-btn btn-primary'" :value="t('indexTable.buttons.upload')" @click="uploadButtonClick" />
    <FormButton :type="'input-btn btn-danger'" :value="t('indexTable.buttons.cancel')" @click="handleUploadCancel" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToken, usePreview, useFileStatus, useFileInput, useLoading, useMode } from '@/stores/state';
import FormButton from '@/components/ui/FormButton.vue';
import showAlert from '@/scripts/showAlert';
import showModal from '@/scripts/showModal';
import Papa from 'papaparse';
import axios from 'axios';
import { useI18n } from "vue-i18n";
import { jwtDecode } from 'jwt-decode';

const { t } = useI18n();
const csvData = usePreview.getCsvData();
const rows = csvData.rows;

// Filter out empty rows
const nonEmptyRows = rows.filter(row =>
  row.some(value => value !== undefined && value !== '')
);
const headers = csvData.headers;
const token = computed(() => useToken.token);
const decodedJwt = jwtDecode(token.value);
const facilityName = ref(decodedJwt.data.facility);
const mode = computed(() => useMode.mode);

onMounted(() => { });

const handleUploadCancel = () => {
  usePreview.removeCsvData();
  useFileStatus.toggleStatus(false, t('upload.history.default.heading'), t('upload.history.default.prompt'));
  useFileInput.toggleStatus(null);
  showAlert("alert-warning", t('indexTable.alerts.cancel.title'), t('indexTable.alerts.cancel.text'));
}

const uploadButtonClick = () => {
  useLoading.toggleVisibility(true);
  useFileStatus.toggleStatus(false, t('upload.history.default.heading'), t('upload.history.default.prompt'));
  uploadFile(headers, rows);
};

const uploadFile = async (headers, _rows) => {
  let filename;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in "YYYY-MM-DD" format
  filename = `${currentDate}_${mode.value}_${facilityName.value}.csv`;

  const csvString = Papa.unparse([headers, ...nonEmptyRows]);
  const blob = new Blob([csvString], { type: 'text/csv' });

  const formData = new FormData();
  formData.append('file', blob, filename);

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const backendPort = import.meta.env.VITE_BACKEND_PORT;
    const backendPath = import.meta.env.VITE_BACKEND_PATH;
    const backendAddress = `${backendUrl}:${backendPort + backendPath}/api/v1/upload`;
    const backendAddress = import.meta.env.NODE_ENV === "production" ?
      "https://ucs.moh.go.tz/liftup-backend/api/v1/upload" :
      "http://170.187.199.69:3010/api/v1/upload";

    const response = await axios.post(backendAddress, formData, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    useFileStatus.toggleStatus(false, t('upload.history.default.heading'), t('upload.history.default.prompt'));
    useLoading.toggleVisibility(false);
    if (!response.data.payload.rejected) {
      showAlert("alert-success", t('indexTable.alerts.success.title'), response.data.payload.message);
    } else {
      const rejectedRows = response.data.payload.rejectedRows.map(row =>
        Object.values(row)
      );
      const rejectedCsvString = Papa.unparse([headers, ...rejectedRows]);
      const blob = new Blob([rejectedCsvString], { type: 'text/csv' });
      showModal(blob, t('indexTable.modals.rejected.title'), t('indexTable.modals.rejected.text'))
    }
    const originalFileName = usePreview.fileName;
    usePreview.addUploadedFile(originalFileName);
    return true;
  } catch (error) {
    useLoading.toggleVisibility(false);
    showAlert("alert-error", t('indexTable.alerts.error.title'), error.message);
    return false;
  }
};

</script>

<style scoped>
.table-container {
  max-height: 75%;
  max-width: 90vw;
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
  background-color: var(--color-success-mute);
  font-size: 1.1em;
}

.table-header td,
th {
  font-weight: bold;
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

@media (max-width: 1024px) {
  table {
    font-size: smaller;
  }

  td {
    padding: 4px;
    max-width: 100px;
    height: 20px;
  }

  th {
    padding: 0 8px 0 8px;
  }
}
</style>