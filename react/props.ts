import { Ref } from "react";
import { ElementHandle } from "./element";

export type ButtonProps = JSX.IntrinsicElements["button"];
export type VectorProps = JSX.IntrinsicElements["svg"];

export interface RefProps<T = HTMLElement> {
  xref?: Ref<T>;
}

export type Icon = (props: VectorProps) => JSX.Element;

export interface IconProps {
  icon: Icon;
}

export interface OptionalIconProps {
  icon?: Icon;
}

export interface TargetProps<T extends Element = Element> {
  target: ElementHandle<T>;
}
