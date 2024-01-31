import { reactive, ref } from "vue";
import { changeLocale } from "@/main";

export const useToken = reactive({
  token: ref(localStorage.getItem("token")),

  setToken(newToken) {
    this.token = newToken;
    localStorage.setItem("token", newToken);
  },

  removeToken() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("path");
    localStorage.removeItem("previewVisible");
    localStorage.removeItem("csvData");
    localStorage.removeItem("mode");
    localStorage.removeItem("FileTitle");
    localStorage.removeItem("FileMessage");
    localStorage.removeItem("FileStatus");
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
  visible: ref(localStorage.getItem("loadingVisible")),

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
const heading = locale === "en" ? "Upload" : "Weka Faili";
const prompt =
  locale === "en" ? "Click/Drag to upload a CSV file." : "Bofya hapa kuweka faili la CSV.";

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
    // localStorage.setItem("FileStatus", status);
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
  csvData: getCsvDataFromLocalStorage(),

  toggleVisibility(visibility) {
    this.visible = visibility;
    localStorage.setItem("previewVisible", visibility);
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
    useFileStatus.toggleStatus(false);
  },
});

export const useFileInput = reactive({
  status: ref(false),

  toggleStatus(status) {
    this.status = status;
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

export const usePath = reactive({
  name: ref(localStorage.getItem("path") || "home"),

  changeName(newName) {
    this.name = newName;
    localStorage.setItem("path", newName);
  },
});

export const useMode = reactive({
  mode: ref(localStorage.getItem("mode") || "clients"),

  changeMode(newMode) {
    this.mode = newMode;
    localStorage.setItem("mode", newMode);
  },
});
