import { curev } from "@curev/eslint-config";

export default curev({
  unocss: true,
  ignores: [
    "**/*.md",
    "**/dist/**",
    "**/coverage/**",
    "**/node_modules/**",
  ],
});
