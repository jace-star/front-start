import type { Component } from "vue";
import katex from "katex";
import { enableKatex } from "markstream-vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store/pinia";
import "@/assets/css/index.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "nprogress/nprogress.css";

enableKatex(() => katex);

const app = createApp(App as Component);

app.use(pinia);
app.use(router);

app.mount("#app");
