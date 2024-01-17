<template>
  <div class="form-group">
    <p class="upload-heading">{{ $t('upload.heading.form') }}</p>
    <form @submit.prevent="login">
      <FormDisabled type="text" :label="$t('upload.input.facilityLabel')" field="facility_name" :value=facilityName />
      <FormDisabled type="text" :label="$t('upload.input.providerLabel')" field="provider_id" :value=userName />
      <div class="input-group input-group-tall">
        <div class="upload-area" tabindex="0" @dragover.prevent @drop="handleDrop" @dragleave="handleDragLeave">
          <img class="small-icon" src="@/assets/upload-icon.png" alt="Upload Icon">
          <p class="upload-title">{{ fileTitle }}</p>
          <p class="upload-details">{{ fileMessage }}</p>
          <input type="file" class="csv-file" tabindex="-1" ref="fileInput" @change="handleFileChange" accept="csv" />
        </div>
      </div>
      <FormButton v-if="fileStatus == true" :value="$t('upload.input.buttonValue')" type="input-btn large-text"
        @click="usePreview.toggleVisibility(true)" />
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import { useToken, usePreview, useFileStatus, useMode } from "@/stores/state";
import Papa from "papaparse";
import showAlert from "@/scripts/showAlert";
import arraysEqual from "@/scripts/arrayEquals";
import FormDisabled from '@/components/ui/FormDisabled.vue';
import FormButton from '@/components/ui/FormButton.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const token = computed(() => useToken.token);
const decodedJwt = jwtDecode(token.value);
const facilityName = ref(decodedJwt.data.facility);
const userName = ref(decodedJwt.data.providerId);
const isDragging = ref(false);
const fileInput = ref(null);
const fileStatus = computed(() => useFileStatus.status);
const fileTitle = computed(() => useFileStatus.title);
const fileMessage = computed(() => useFileStatus.message);
const csvData = ref(null);
const mode = computed(() => useMode.mode);

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
      useFileStatus.toggleStatus(true, file.name, t('upload.validation.passed.prompt'));
      if (files[0].type != "text/csv") {
        useFileStatus.toggleStatus(false, t('upload.validation.type.heading'), t('upload.validation.type.prompt'));
        fileInput.value = null;
        showAlert("alert-error", t('upload.alerts.type.title'), t('upload.alerts.type.text'));
      } else if (files[0].size > import.meta.env.VITE_MAX_FILE_SIZE) {
        useFileStatus.toggleStatus(false, t('upload.validation.size.heading'), t('upload.validation.size.prompt'));
        fileInput.value = null;
        showAlert("alert-error", t('upload.alerts.size.title'), t('upload.alerts.size.text'));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          Papa.parse(reader.result, {
            complete: (result) => {
              csvData.value = result.data;
              const rawCsvData = csvData._rawValue;
              const expectedHeaders = import.meta.env.VITE_CSV_HEADERS.split(",");
              const expectedClientsHeaders = import.meta.env.VITE_CSV_CLIENTS_HEADERS.split(",");
              const expectedContactsHeaders = import.meta.env.VITE_CSV_CONTACTS_HEADERS.split(",");


              if (mode.value == 'clients') {
                if (!arraysEqual(rawCsvData[0], expectedClientsHeaders)) {
                  useFileStatus.toggleStatus(false, t('upload.validation.headers.heading'), t('upload.validation.headers.prompt'));
                  fileInput.value = null;
                  showAlert("alert-error", t('upload.alerts.headers.clients.title'), t('upload.alerts.headers.clients.text'));
                } else {
                  // Check the format for every fifth column starting from the second row (index 1)
                  const isValidFormat = rawCsvData.slice(1).every(row => {
                    const fifthColumnValue = row[4]; // 4 for fifth row (dob)
                    return isDateFormatValid(fifthColumnValue);
                  });
                  if (isValidFormat) {
                    // If the format is valid for every fifth column, proceed to usePreview
                    usePreview.setCsvData(rawCsvData[0], rawCsvData.slice(1))
                  } else {
                    // If the format check fails for any fifth column, show an error alert
                    useFileStatus.toggleStatus(false, t('upload.validation.dob.heading'), t('upload.validation.dob.prompt'));
                    fileInput.value = null;
                    showAlert("alert-error", t('upload.alerts.headers.dob.title'), t('upload.alerts.headers.dob.text'));
                  }
                }
              } else {
                if (!arraysEqual(rawCsvData[0], expectedContactsHeaders)) {
                  useFileStatus.toggleStatus(false, t('upload.validation.headers.heading'), t('upload.validation.headers.prompt'));
                  fileInput.value = null;
                  showAlert("alert-error", t('upload.alerts.headers.contacts.title'), t('upload.alerts.headers.contacts.text'));
                } else {
                  // Check the format for every fifth column starting from the second row (index 1)
                  const isValidFormat = rawCsvData.slice(1).every(row => {
                    const fifthColumnValue = row[3]; // 4 for fifth row (dob)
                    return isDateFormatValid(fifthColumnValue);
                  });
                  if (isValidFormat) {
                    // If the format is valid for every fifth column, proceed to usePreview
                    usePreview.setCsvData(rawCsvData[0], rawCsvData.slice(1))
                  } else {
                    // If the format check fails for any fifth column, show an error alert
                    useFileStatus.toggleStatus(false, t('upload.validation.dob.heading'), t('upload.validation.dob.prompt'));
                    fileInput.value = null;
                    showAlert("alert-error", t('upload.alerts.headers.dob.title'), t('upload.alerts.headers.dob.text'));
                  }
                }
              }
            },
          });
        };
        reader.readAsText(file);
      }
    }
  }
}

function isDateFormatValid(dateString) {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString == undefined || '') {
    return true;
  } else {
    return dateFormatRegex.test(dateString);
  }
}



</script>



<style scoped>
.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 5px;
  background-color: var(--color-background-soft);
  text-align: center;
  cursor: pointer;
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.upload-area:hover {
  border-color: var(--color-border-hover);
}

.upload-area input {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: var(--color-text);
}

.upload-area .upload-title {
  font-weight: bold;
  font-size: 1.1em;
}

.upload-area .upload-details {
  font-size: 1.1em;
}

.upload-area .small-icon {
  height: 32px;
  width: 32px;
  margin-top: 10px;
}
</style>