import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import UploadView from "../views/UploadView.vue";
import { useToken } from "@/stores/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      // route level code-splitting
      // this generates a separate chunk (Upload.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import("../views/UploadView.vue"),
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
