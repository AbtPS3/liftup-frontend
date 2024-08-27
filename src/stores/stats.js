import { reactive, ref } from "vue";

function getUserUploadStats() {
  const savedStats = localStorage.getItem("userUploadStats");
  try {
    return savedStats ? JSON.parse(savedStats) : {};
  } catch (e) {
    // If there's an error parsing the data, return an empty object
    return {};
  }
}

export const useUserUploadStats = reactive({
  userUploadStats: ref(getUserUploadStats()),

  setUserUploadStats(uploadStats) {
    this.userUploadStats = uploadStats;
    localStorage.setItem("userUploadStats", JSON.stringify(uploadStats));
  },

  removeUserUploadStats() {
    localStorage.removeItem("userUploadStats");
  },
});
