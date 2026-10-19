import type { Router } from "vue-router";
import { appConfig } from "@/config";

export function useTitleGuard(router: Router) {
  router.afterEach((to) => {
    const pageTitle = to.meta.title;
    document.title
      = pageTitle && pageTitle !== appConfig.appTitle
        ? `${pageTitle} · ${appConfig.appTitle}`
        : appConfig.appTitle;
  });
}
