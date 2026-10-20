import type { Router } from "vue-router";

export function useTitleGuard(router: Router) {
  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
  });
}
