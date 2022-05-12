
//定义所有.vue结尾的类型的
declare module "*.vue"{
  import type { defineComponent } from "vue";
  const component:defineComponent<{},{},any>
  export default component
}