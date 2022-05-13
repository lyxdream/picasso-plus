import { ExtractPropTypes } from "vue";
export const iconProps = {
  size: {
    type: Number,
  },
  color: {
    type: String,
  },
} as const;
// ExtractPropTypes 的另一个问题，这个工具类型提取出来的其实是用于 setup 函数的 props 而不是外界传入的 props，
// 在 prop 没有 required 的情况下需要使用 Partial<ExtractPropTypes<typeof xxxProps>> 才能给出实际外部的 props 的类型。
// 值指导类型下不得不引入 ExtractPropTypes 来将 props 值定义转为类型定义，但 vue 没有提供 ExtractPropTypes 的逆运算，导致在定义共有 props 组件 (props 继承) 的时候十分难受
export type IconProps = ExtractPropTypes<typeof iconProps>;
