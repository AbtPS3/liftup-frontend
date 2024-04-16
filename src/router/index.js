import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import UploadView from "@/views/UploadView.vue";
import { useToken } from "@/stores/state";
import InstructionsView from "@/views/InstructionsView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/upload",
      name: "upload",
      component: UploadView,
    },
    {
      path: "/instructions",
      name: "instructions",
      component: InstructionsView,
    },
  ],
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = useToken.token != null ? true : false;

  if (to.name !== "login" && !isAuthenticated) {
    // If the user is not authenticated and trying to access a protected route,
    // redirect them to the login page
    // next("/");
    next({ name: "login" });
  } else {
    // Allow the navigation
    next();
  }
});

export default router;
