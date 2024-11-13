import { reactive, ref } from "vue";

function getUserUploadStats() {
  const savedStats = ref(localStorage.getItem("userUploadStats")) || ref(null);
  try {
    return savedStats ? JSON.parse(savedStats) : {};
  } catch (e) {
    // If there's an error parsing the data, return an empty object
    return {};
  }
}

function getAdminUploadStats() {
  const savedStats = ref(localStorage.getItem("adminUploadStats"));
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

export const useAdminUploadStats = reactive({
  adminUploadStats: ref(getAdminUploadStats()),

  setAdminUploadStats(uploadStats) {
    this.adminUploadStats = uploadStats;
    localStorage.setItem("adminUploadStats", JSON.stringify(uploadStats));
  },

  removeAdminUploadStats() {
    localStorage.removeItem("adminUploadStats");
  },
});
