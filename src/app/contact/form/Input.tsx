"use client";

import React, {
  forwardRef,
  ForwardedRef,
  ComponentPropsWithoutRef,
  ElementType,
  MutableRefObject,
} from "react";
import { FieldError } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import clsx from "clsx";

type ValidElement = "input" | "textarea" | "select";

type RefType<T extends ValidElement> = T extends "input"
  ? HTMLInputElement
  : T extends "textarea"
  ? HTMLTextAreaElement
  : HTMLSelectElement;

type InputProps<T extends ValidElement = "input"> = {
  as?: T;
  errors?: FieldError;
} & ComponentPropsWithoutRef<T>;

// `React.FC` を適用した Input コンポーネント
const InputComponent = <T extends ValidElement>(
  { as, errors, className, ...props }: InputProps<T>,
  ref: ForwardedRef<RefType<T>>
) => {
  const Component = (as || "input") as ElementType;

  console.log("===== Debug Info =====");
  console.log("Component Type:", Component, "Typeof:", typeof Component);
  console.log(
    "Ref Type:",
    ref,
    "Typeof Ref:",
    typeof ref,
    "Is Function:",
    typeof ref === "function",
    "Is Object:",
    typeof ref === "object"
  );
  console.log("Props Type:", props);

  return (
    <div className="w-full">
      <Component
        {...props}
        ref={(el: RefType<T> | null) => {
          console.log("==== Ref Assignment Debug ====");
          console.log("Element Received:", el);
          console.log("Typeof Element:", typeof el);
          console.log("Instanceof Input:", el instanceof HTMLInputElement);
          console.log(
            "Instanceof Textarea:",
            el instanceof HTMLTextAreaElement
          );
          console.log("Instanceof Select:", el instanceof HTMLSelectElement);

          if (typeof ref === "function") {
            console.log("Assigning to function ref");
            ref(el);
          } else if (ref && "current" in ref) {
            console.log("Assigning to object ref");
            (ref as MutableRefObject<RefType<T> | null>).current = el;
          }
        }}
        className={clsx(
          "border rounded-lg p-4 w-full",
          errors ? "border-red-500" : "border-gray-300",
          className
        )}
      />
      {errors?.message && <ErrorMessage message={errors.message} />}
    </div>
  );
};

// `React.FC` を適用した形で `forwardRef` に渡す
// forwardRef を React.FC と組み合わせるために InputComponent を分ける必要がある様子
// forwardRef の戻り値を React.FC として型付け
const Input: React.FC<InputProps<ValidElement>> = forwardRef(
  InputComponent
) as React.FC<InputProps<ValidElement>>;

Input.displayName = "Input"; // ESLint対策

console.log("DisplayName:", Input.displayName);

export default Input;
