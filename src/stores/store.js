// alert.js
import { reactive } from "vue";

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
  // Retrieve the token from localStorage on initialization
  token: localStorage.getItem("token"),

  setToken(token) {
    // Save the token to localStorage
    localStorage.setItem("token", token);
    this.token = token;
  },

  removeToken() {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    this.token = null;
  },
});
