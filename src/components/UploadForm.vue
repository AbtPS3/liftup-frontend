<template>
  <div class="form-group">
    <p class="upload-heading">{{ $t('upload.heading.form') }}</p>
    <form @submit.prevent="login">
      <FormDisabled type="text" :label="$t('upload.input.facilityLabel')" field="facility_name" :value=facilityName />
      <FormDisabled type="text" :label="$t('upload.input.providerLabel')" field="provider_id" :value=userName />
      <div class="input-group input-group-tall">
        <div class="upload-area" tabindex="0" @dragover.prevent="handleDragOver" @drop="handleDrop"
          @dragleave="handleDragLeave">
          <img class="small-icon" src="@/assets/upload-icon.png" alt="Upload Icon">
          <p class="upload-title">{{ fileTitle }}</p>
          <p class="upload-details">{{ fileMessage }}</p>
          <input type="file" class="csv-file" tabindex="-1" ref="fileInput" @change="handleFileChange"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
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
import * as XLSX from "xlsx";
import moment from "moment";

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

      if (fileType === 'text/csv' || fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // CSV or Excel file
        useFileStatus.toggleStatus(true, file.name, t('upload.validation.passed.prompt'));
        if (fileType !== 'text/csv') {
          // Handle Excel file
          readExcelFile(file);
        } else {
          // Handle CSV file
          readCsvFile(file);
        }
      } else {
        useFileStatus.toggleStatus(false, t('upload.validation.type.heading'), t('upload.validation.type.prompt'));
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
          processData(rawCsvData, expectedClientsHeaders, 'clients', clientsDateColumnIndex, clientsCtcNumberColumnIndex);
        } else {
          processData(rawCsvData, expectedContactsHeaders, 'contacts', contactsDateColumnIndex, contactsCtcNumberColumnIndex);
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
      processData(nonEmptyExcelRows, expectedClientsHeaders, 'clients', clientsDateColumnIndex, clientsCtcNumberColumnIndex);
    } else {
      processData(nonEmptyExcelRows, expectedContactsHeaders, 'contacts', contactsDateColumnIndex, contactsCtcNumberColumnIndex);
    }
  };
  reader.readAsArrayBuffer(file);
};


const isDateFormatValid = (dateString) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString == undefined || dateString == '') {
    return false;
  } else {
    return dateFormatRegex.test(dateString);
  }
}

const formatDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  // Handle the first row exception - misomisondo umepigaje hapo
  if (dateString === "dateOfBirth") {
    return "dateOfBirth";
  }

  const dateStringAsString = dateString.toString();
  const dateFormat1 = 'YYYY-MM-DD';
  const parsedDate = moment(new Date(dateStringAsString));
  if (parsedDate.isValid()) {
    return parsedDate.format(dateFormat1);
  } else {
    return null;
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

const processData = (rawData, expectedHeaders, mode, dateColumnIndex, ctcNumberColumnIndex) => {
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

    console.log("Formated Data", formattedData);

    // Check the format for every date column starting from the second row (index 1)
    const dateIsValidFormat = formattedData.slice(1).every(row => {
      const formattedDateColumnValue = row[dateColumnIndex];
      return isDateFormatValid(formattedDateColumnValue);
    });

    // Check the format for every date column starting from the second row (index 1)
    const ctcNumberIsValidFormat = formattedData.slice(1).every(row => {
      const formattedCtcNumberColumnValue = row[ctcNumberColumnIndex];
      return isCtcNumberFormatValid(formattedCtcNumberColumnValue);
    });

    if (!dateIsValidFormat) {
      // If the format check fails for any date column, show an error alert
      useFileStatus.toggleStatus(false, t('upload.validation.dob.heading'), t('upload.validation.dob.prompt'));
      fileInput.value = null;
      showAlert(`alert-error`, t(`upload.alerts.headers.dob.title`), t(`upload.alerts.headers.dob.text`));

    } else if (!ctcNumberIsValidFormat) {
      // If the format check fails for any CTC column, show an error alert
      useFileStatus.toggleStatus(false, t('upload.validation.ctc.heading'), t('upload.validation.ctc.prompt'));
      fileInput.value = null;
      showAlert(`alert-error`, t(`upload.alerts.headers.ctc.title`), t(`upload.alerts.headers.ctc.text`));
    } else {
      // If the format is valid for every date column, proceed to usePreview
      usePreview.setCsvData(formattedData[0], formattedData.slice(1));
    }
  }
};


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
