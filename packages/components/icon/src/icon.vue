<template>
  <i class="p-icon-loading" :style="style">
    <slot></slot>
  </i>
</template>
<script lang="ts">
import { computed, CSSProperties, defineComponent } from "vue";
import { iconProps } from "./icon";
export default defineComponent({
  name: "PIcon",
  props: iconProps,
  setup(props) {
    const style = computed<CSSProperties>(() => {
      if (!props.size && !props.color) return {};
      return {
        fontSize: props.size ? props.size + "px" : undefined,
        color: props.color ? props.color : undefined,
      };
    });
    return {
      style,
    };
  },
});
</script>