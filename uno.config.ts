import type { Preset } from "unocss";
import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import { presetBlock } from "unocss-preset-block";
import { presetPalette } from "unocss-preset-palette";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetWind4() as Preset,
    presetBlock(),
    presetPalette({
      colorFormat: "rgb",
      themeColors: {
        "primary": [59, 130, 246],
        "primary-hover": [37, 99, 235],
        "primary-light": [239, 246, 255],
        "success": [34, 197, 94],
        "fail": [255, 72, 72],
        "warning": [245, 158, 11],
        "danger": [239, 68, 68],
        "back": [255, 255, 255],
        "grey": [148, 163, 184],
        "regular": [100, 116, 139],
        "standard": [51, 65, 85],
        "neutral": [248, 250, 252],
        "boundary": [241, 245, 249],
        "sidebar": [255, 255, 255],
        "sidebar-hover": [232, 239, 255],
      },
      cssVarName: "color-[name]",
    }),
    presetAnimations() as Preset,
    presetShadcn(
      {
        color: "neutral",
      },
      {
        componentLibrary: "reka",
      },
    ) as Preset,
  ],
  rules: [
    // 自定义 font-size: text-<N>px
    [/^text-(\d+)px$/, ([_, s]) => ({ "font-size": `${s}px` })],
    // 自定义 font-weight: font-<N>
    [/^font-(\d+)$/, ([_, w]) => ({ "font-weight": `${w}` })],
    // 自定义 border-radius: rounded-<N>px
    [/^rounded-(\d+)px$/, ([_, r]) => ({ "border-radius": `${r}px` })],
    // 自定义 letter-spacing: tracking-<N>px
    [/^tracking-([\d.]+)px$/, ([_, s]) => ({ "letter-spacing": `${s}px` })],
    [
      "text-justify-last",
      {
        "text-align-last": "justify",
        "text-align": "justify",
      },
    ],
    [
      /divider-(x|y)/,
      ([_]) => {
        return {
          "--divider-width": "0.5px",
          "--divider-color": "currentColor",
          "--divider-style": "solid",
          "border-width": "var(--divider-width)",
          "border-color": "var(--divider-color)",
          "border-style": "var(--divider-style)",
        };
      },
      {
        autocomplete: ["divider-(x|y)"],
      },
    ],
    [
      /divider-(dashed|dotted|solid)/,
      ([_, style]) => {
        return {
          "--divider-style": style,
        };
      },
      {
        autocomplete: ["divider-(dashed|dotted|solid)"],
      },
    ],
  ],
  transformers: [
    transformerDirectives({
      applyVariable: ["--at-apply", "--uno-apply", "--uno"],
    }),
    transformerVariantGroup(),
  ],
  // shadcn-vue 组件里的 class 常写在 .ts 中，需纳入扫描
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        "(components|src)/**/*.{js,ts}",
      ],
    },
  },
});
