import type { Router } from "vue-router";

export function useRedirectGuard(router: Router) {
  router.beforeEach(async (to) => {
    const redirect = to.meta.redirect?.replace(/:(\w+)/g, (_, p1: string) => {
      const value = (to.params as Record<string, string | string[] | undefined>)[p1];
      if (value === undefined) {
        return "";
      }
      return Array.isArray(value) ? value[0] ?? "" : value;
    });

    if (redirect === to.path) {
      return true;
    }

    if (redirect) {
      return redirect;
    }

    return true;
  });
}
