import { reactive, ref } from "vue";
import { changeLocale } from "@/main";

export const useToken = reactive({
  token: ref(localStorage.getItem("token") || ref(null)),

  setToken(newToken) {
    this.token = newToken;
    localStorage.setItem("token", newToken);
    usePath.changeName("upload");
  },

  removeToken() {
    useLoading.toggleVisibility(true);
    this.token = null;
    localStorage.removeItem("token");
  },
});

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

export const useModal = reactive({
  visible: false,
  title: "",
  message: "",
  data: [],
  toggleVisibility(visibility) {
    this.visible = visibility;
  },
  changeTitle(title) {
    this.title = title;
  },
  changeMessage(message) {
    this.message = message;
  },
  changeData(data) {
    this.data = data;
  },
});

export const useLoading = reactive({
  visible: ref(false),

  toggleVisibility(visibility) {
    this.visible = visibility;
  },
});

export const useLocale = reactive({
  language: ref(localStorage.getItem("locale") || "en"),

  changeLanguage(selectedLanguage) {
    this.language = selectedLanguage;
    changeLocale(selectedLanguage);
  },
});

export const useFileStatus = reactive({
  title: ref(useLocale.language === "en" ? "Upload" : "Weka Faili"),
  message: ref(useLocale.language === "en" ? "Click/Drag to upload XLSX/CSV." : "Bofya kuweka faili la XLSX/CSV."),
  status: ref(false),
  toggleStatus(status, title, message) {
    this.setFileStatus(status);
    this.setFileTitle(title);
    this.setFileMessage(message);
  },
  setFileStatus(status) {
    this.status = status;
  },
  setFileTitle(title) {
    this.title = title;
  },
  setFileMessage(message) {
    this.message = message;
  },
});

export const usePreview = reactive({
  visible: ref(false),
  csvData: { headers: [], rows: [] },
  originalFileName: ref(""),
  uploadedFilesList: JSON.parse(localStorage.getItem("uploadedFiles") || "[]"),
  toggleVisibility(visibility) {
    this.visible = visibility;
  },
  setCsvData(headers, rows, fileName) {
    const payload = { headers, rows };
    this.csvData = payload;
    this.fileName = fileName;
  },
  getCsvData() {
    return this.csvData;
  },
  removeCsvData() {
    this.csvData = { headers: [], rows: [] };
    this.visible = false;
    useFileStatus.toggleStatus(false);
  },
  addUploadedFile(fileName) {
    this.uploadedFilesList.push(fileName);
    localStorage.setItem("uploadedFiles", JSON.stringify(this.uploadedFilesList));
  },
  getUploadedFiles() {
    return this.uploadedFilesList;
  },
  removeUploadedFiles() {
    this.uploadedFilesList = [];
  },
});

export const useFileInput = reactive({
  status: ref(false),
  toggleStatus(status) {
    this.status = status;
  },
});

export const usePath = reactive({
  name: ref("home"),
  changeName(newName) {
    this.name = newName;
  },
});

export const useMode = reactive({
  mode: ref("clients"),
  changeMode(newMode) {
    this.mode = newMode;
  },
});
