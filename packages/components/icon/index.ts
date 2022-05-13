import Icon from "./src/icon.vue";
import { withInstall } from "@picasso-plus/utils/install";
// Icon.install = (app: App) => {
//   app.component(Icon.name, Icon);
// };
export const PIcon = withInstall(Icon);
export default PIcon;
