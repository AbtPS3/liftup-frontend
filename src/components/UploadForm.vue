<template>
  <div class="form-group">
    <p class="upload-heading">{{ $t('upload.heading.form') }}</p>
    <form @submit.prevent="upload">
      <FormDisabled type="text" :label="$t('upload.input.facilityLabel')" field="facility_name" :value=facilityName />
      <FormDisabled type="text" :label="$t('upload.input.providerLabel')" field="provider_id" :value=userName />
      <div class="input-group input-group-tall">
        <div class="upload-area" tabindex="0" @dragover.prevent="handleDragOver" @drop="handleDrop"
          @dragleave="handleDragLeave">
          <p class="upload-title" v-if="fileStatus == true">{{ $t('upload.validation.valid.heading') }}</p>
          <p class="upload-title" v-else>{{ $t('upload.history.default.heading') }}</p>
          <div class="uploaded-wrapper">
            <span class="uploaded-files" v-if="fileStatus == true">{{ $t('upload.validation.valid.prompt') }}</span>
            <span class="uploaded-files" v-for="ufile of lastFiveFiles" v-else-if="uploadedFiles.length > 0">{{ ufile
              }}</span>
            <span class="uploaded-files" v-else>{{ $t('upload.history.default.prompt') }}</span>
          </div>
        </div>
      </div>
      <FormButton v-if="fileStatus == true" :value="$t('upload.input.buttonValue')" type="input-btn large-text"
        @click="usePreview.toggleVisibility(true)" />
    </form>

  </div>
  <input type="file" name="upload-circle" id="uc" class="hidden" style="display: none" ref="fileInput"
    @change="handleFileChange"
    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  <label class="upload-circle" for="uc">+</label>
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
import * as XLSX from "xlsx";
import moment from "moment";
import { parse } from "papaparse";

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
const uploadedFiles = computed(() => usePreview.uploadedFilesList);
const lastFiveFiles = computed(() => uploadedFiles.value.reverse().slice(0, 5));

// Shared environment variables
const expectedClientsHeaders = import.meta.env.VITE_CSV_CLIENTS_HEADERS.split(",");
const expectedContactsHeaders = import.meta.env.VITE_CSV_CONTACTS_HEADERS.split(",");
const clientsCtcNumberColumnIndex = import.meta.env.VITE_CSV_CLIENTS_CTC_COLUMN - 1;
const contactsCtcNumberColumnIndex = import.meta.env.VITE_CSV_CONTACTS_CTC_COLUMN - 1;
const clientsDateColumnIndex = import.meta.env.VITE_CSV_CLIENTS_DATE_COLUMN - 1;
const contactsDateColumnIndex = import.meta.env.VITE_CSV_CONTACTS_DATE_COLUMN - 1;


const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true; // Setting isDragging to true when dragover event occurs
  fileMessage.value = "Release to upload!"; // Changing the message when a dragover event occurs!
};

const handleDrop = async (event) => {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer.files;
  processFile(files)
  event.dataTransfer.value = "";
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleFileChange = async (event) => {
  const files = event.target.files;
  processFile(files)
  event.target.value = "";
};

function processFile(files) {
  for (const file of files) {
    if (files.length > 0) {
      const fileType = file.type;
      const uploadedFiles = usePreview.uploadedFilesList;
      uploadedFiles.forEach(uploadedFile => {
        if (file.name == uploadedFile) {
          showAlert("alert-error", t('upload.alerts.repeat.title'), t('upload.alerts.repeat.text'));
        }
      });

      if (fileType === 'text/csv' || fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // CSV or Excel file
        useFileStatus.toggleStatus(true, file.name, t('upload.history.default.prompt'));
        if (fileType !== 'text/csv') {
          // Handle Excel file
          readExcelFile(file);
        } else {
          // Handle CSV file
          readCsvFile(file);
        }
      } else {
        useFileStatus.toggleStatus(false, t('upload.history.default.heading'), t('upload.history.default.prompt'));
        fileInput.value = null;
        showAlert("alert-error", t('upload.alerts.type.title'), t('upload.alerts.type.text'));
      }
    }
  }
}

// Handling CSV files
const readCsvFile = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    Papa.parse(reader.result, {
      complete: (result) => {
        // Process CSV data
        csvData.value = result.data;
        const rawCsvData = csvData._rawValue;
        const expectedClientsHeaders = import.meta.env.VITE_CSV_CLIENTS_HEADERS.split(",");
        const expectedContactsHeaders = import.meta.env.VITE_CSV_CONTACTS_HEADERS.split(",");
        if (mode.value === 'clients') {
          processData(rawCsvData, expectedClientsHeaders, 'clients', clientsDateColumnIndex, clientsCtcNumberColumnIndex, file.name);
        } else {
          processData(rawCsvData, expectedContactsHeaders, 'contacts', contactsDateColumnIndex, contactsCtcNumberColumnIndex, file.name);
        }
      },
    });
  };
  reader.readAsText(file);
}

// Handling EXCEL files
const readExcelFile = (file) => {
  const reader = new FileReader();
  reader.onload = (excel) => {
    const data = new Uint8Array(excel.target.result);
    const workbook = XLSX.read(data, { type: 'array', raw: true, cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const rawExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true, cellDates: true });

    // Filter out empty lines
    const nonEmptyExcelRows = rawExcelData.filter(row => row.some(cell => cell !== null && cell !== ''));

    if (mode.value === 'clients') {
      processData(nonEmptyExcelRows, expectedClientsHeaders, 'clients', clientsDateColumnIndex, clientsCtcNumberColumnIndex, file.name);
    } else {
      processData(nonEmptyExcelRows, expectedContactsHeaders, 'contacts', contactsDateColumnIndex, contactsCtcNumberColumnIndex, file.name);
    }
  };
  reader.readAsArrayBuffer(file);
};


// Date Validator Update - April 09, 2024
const isDateFormatValid = (formattedDateValue) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/; // Watches for a formatted date yyyy-mm-dd

  if (formattedDateValue == undefined || formattedDateValue == '') {
    return false;
  } else {
    // Check if the date string matches either date format regex or age format regex
    if (!dateFormatRegex.test(formattedDateValue)) {
      return false;
    }
  }

  // If all date strings are valid, return final validFormat
  return true;
}




const formatDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  // Handle the first row exception - misomisondo umepigaje hapo
  if (dateString === "dateOfBirth") {
    return "dateOfBirth";
  }

  if (!isNaN(dateString) && dateString >= 15 && dateString <= 55) {
    const today = new Date();
    const yearOfBirth = today.getFullYear() - parseInt(dateString);
    console.log("Year of Birth", yearOfBirth);
    const formattedDate = `01-07-${yearOfBirth}`;
    const dateStringAsString = formattedDate.toString();
    const dateFormat1 = 'YYYY-MM-DD';
    const parsedDate = moment(new Date(dateStringAsString));
    if (parsedDate.isValid()) {
      return parsedDate.format(dateFormat1);
    } else {
      return null;
    }
  }

  const dateStringAsString = dateString.toString();
  const dateFormat1 = 'YYYY-MM-DD';
  const parsedDate = moment(new Date(dateStringAsString));
  if (parsedDate.isValid()) {
    return parsedDate.format(dateFormat1);
  } else {
    return false;
  }
}

const isCtcNumberFormatValid = (ctcNumberString) => {
  const ctcNumberFormatRegex = /^\d{2}-\d{2}-\d{4}-\d{6}$/;
  if (ctcNumberString == undefined || ctcNumberString == '') {
    return false;
  } else {
    return ctcNumberFormatRegex.test(ctcNumberString);
  }
}

const processData = (rawData, expectedHeaders, mode, dateColumnIndex, ctcNumberColumnIndex, fileName) => {
  if (!arraysEqual(rawData[0], expectedHeaders)) {
    useFileStatus.toggleStatus(false, t('upload.validation.headers.heading'), t('upload.validation.headers.prompt'));
    fileInput.value = null;
    showAlert(`alert-error`, t(`upload.alerts.headers.${mode}.title`), t(`upload.alerts.headers.${mode}.text`));
  } else {
    // Map the rawData to replace the date column with formatted date values
    const formattedData = rawData.map(row => {
      const dateColumnValue = row[dateColumnIndex];
      const formattedDateColumnValue = formatDate(dateColumnValue);
      return [...row.slice(0, dateColumnIndex), formattedDateColumnValue, ...row.slice(dateColumnIndex + 1)];
    });

    // Filter out empty rows
    const nonEmptyRows = formattedData.filter(row => {
      return !row.every(value => value === null || value === undefined || value.trim() === "");
    });

    // Check the format for every date column starting from the second row (index 1)
    const dateIsValidFormat = nonEmptyRows.slice(1).every(row => {
      const formattedDateColumnValue = row[dateColumnIndex];
      return isDateFormatValid(formattedDateColumnValue);
    });

    // Check the format for every date column starting from the second row (index 1)
    const ctcNumberIsValidFormat = nonEmptyRows.slice(1).every(row => {
      const formattedCtcNumberColumnValue = row[ctcNumberColumnIndex];
      return isCtcNumberFormatValid(formattedCtcNumberColumnValue);
    });

    if (!dateIsValidFormat) {
      // If the format check fails for any date column, show an error alert
      useFileStatus.toggleStatus(false, t('upload.validation.dob.heading'), t('upload.validation.dob.prompt'));
      fileInput.value = null;
      return showAlert(`alert-error`, t(`upload.alerts.headers.dob.title`), t(`upload.alerts.headers.dob.text`));

    } else if (!ctcNumberIsValidFormat) {
      // If the format check fails for any CTC column, show an error alert
      useFileStatus.toggleStatus(false, t('upload.validation.ctc.heading'), t('upload.validation.ctc.prompt'));
      fileInput.value = null;
      showAlert(`alert-error`, t(`upload.alerts.headers.ctc.title`), t(`upload.alerts.headers.ctc.text`));
    } else {
      // If the format is valid for every date column, proceed to usePreview
      useFileStatus.toggleStatus(true, t('upload.validation.valid.heading'), t('upload.validation.valid.prompt'));
      usePreview.setCsvData(nonEmptyRows[0], nonEmptyRows.slice(1), fileName);
    }
  }
};


</script>

<style scoped>
.upload-area {
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background-color: var(--color-background-soft);
  text-align: center;
  /* cursor: pointer; */
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

.upload-circle {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mq-green-norm);
  color: white;
  width: 50px;
  height: 50px;
  font-size: xx-large;
  font-weight: lighter;
  border-radius: 30%;
  box-shadow: 1px 1px 3px var(--mq-divider-light-norm);
  cursor: pointer;
}

.upload-circle:hover {
  background-color: var(--mq-green-soft);
  color: white;
  box-shadow: 2px 2px 5px var(--mq-divider-light-norm);
}

.uploaded-wrapper {
  position: relative;
  display: inline;
}

.uploaded-files {
  display: inline-block;
  margin: 5px 5px;
  padding: 0 5px;
  /* font-size: smaller !important; */
  background-color: var(--color-background-fade);
  color: white;
  border-radius: 10px;
}

@media (max-width: 1024px) {
  .upload-circle {
    position: absolute;
    bottom: 35%;
    left: 45%;
  }

  .upload-area {
    margin-top: 30px;
  }
}
</style>
