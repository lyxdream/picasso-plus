import { createApp } from "vue";
import App from "./app.vue";
import { PIcon } from "@picasso-plus/components/icon";
import "@picasso-plus/theme-chalk/src/index.scss";
createApp(App).use(PIcon).mount("#app");
