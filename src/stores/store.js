import { reactive, ref } from "vue";

export const useAlert = reactive({
  visible: false,
  title: "",
  message: "",
  type: "",
  toggleVisibility(visibility) {
    this.visible = visibility;
  },
  changeTitle(title) {
    this.title = title;
  },
  changeMessage(message) {
    this.message = message;
  },
  changeType(type) {
    this.type = type;
  },
});

export const useLoading = reactive({
  visible: false,

  toggleVisibility(visibility) {
    this.visible = visibility;
  },
});

export const useToken = reactive({
  token: localStorage.getItem("token"),

  setToken(token) {
    localStorage.setItem("token", token);
    this.token = token;
  },

  removeToken() {
    localStorage.removeItem("token");
    useLoading.toggleVisibility(true);
    this.token = null;
  },
});

export const usePreview = reactive({
  visible: false,
  csvData: getCsvDataFromLocalStorage(),

  toggleVisibility(visibility) {
    this.visible = visibility;
  },

  setCsvData(headers, rows) {
    const payload = { headers, rows };
    localStorage.setItem("csvData", JSON.stringify(payload));
    this.csvData = payload;
  },

  getCsvData() {
    return this.csvData;
  },

  removeCsvData() {
    localStorage.removeItem("csvData");
    this.csvData = { headers: [], rows: [] };
    this.visible = false;
    useFileStatus.toggleValue(false);
  },
});

export const useFileStatus = reactive({
  value: ref(localStorage.getItem("FileStatus") || false),
  title: ref(localStorage.getItem("FileTitle") || "Upload"),
  message: ref(localStorage.getItem("FileMessage") || "Click to upload CSV."),

  toggleValue(value, title, message) {
    this.setFileStatus(value);
    this.setFileTitle(title);
    this.setFileMessage(message);
  },

  setFileStatus(value) {
    localStorage.setItem("FileStatus", value);
    this.value = value;
  },

  setFileTitle(title) {
    localStorage.setItem("FileTitle", title);
    this.title = title;
  },

  setFileMessage(message) {
    localStorage.setItem("FileMessage", message);
    this.message = message;
  },
});

export const useFileInput = reactive({
  value: false,

  toggleValue(value) {
    this.value = value;
  },
});

function getCsvDataFromLocalStorage() {
  const storedData = localStorage.getItem("csvData");
  try {
    return storedData ? JSON.parse(storedData) : { headers: [], rows: [] };
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    return { headers: [], rows: [] };
  }
}
