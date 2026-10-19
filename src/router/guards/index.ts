import type { Router } from "vue-router";
import { useProgressGuard } from "./progress";
import { useRedirectGuard } from "./redirect";
import { useTitleGuard } from "./title";

const guards = [useRedirectGuard, useProgressGuard, useTitleGuard];

export function setupRouterGuard(router: Router) {
  for (const guard of guards) {
    guard(router);
  }
}
