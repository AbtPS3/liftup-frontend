import { reactive, ref } from "vue";
import { changeLocale } from "@/main";

export const useToken = reactive({
  token: ref(localStorage.getItem("token")),

  setToken(newToken) {
    this.token = newToken;
    localStorage.setItem("token", newToken);
    usePath.changeName("upload");
  },

  removeToken() {
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

export const useLoading = reactive({
  visible: ref(false),

  toggleVisibility(visibility) {
    this.visible = visibility;
  },
});

export const useLocale = {
  language: localStorage.getItem("locale"),

  changeLanguage(selectedLanguage) {
    this.language = selectedLanguage;
    changeLocale(selectedLanguage);
  },
};

const locale = localStorage.getItem("locale");
const heading = locale === "en" || !locale ? "Upload" : "Weka Faili";

const prompt =
  locale === "en" || !locale
    ? "Click/Drag to upload a CSV file."
    : "Bofya hapa kuweka faili la CSV.";
export const useFileStatus = reactive({
  status: ref(false),
  title: ref("" || heading),
  message: ref("" || prompt),
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
  visible: false,
  csvData: { headers: [], rows: [] },
  toggleVisibility(visibility) {
    this.visible = visibility;
  },
  setCsvData(headers, rows) {
    const payload = { headers, rows };
    this.csvData = payload;
  },
  getCsvData() {
    return this.csvData;
  },
  removeCsvData() {
    this.csvData = { headers: [], rows: [] };
    this.visible = false;
    useFileStatus.toggleStatus(false);
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
