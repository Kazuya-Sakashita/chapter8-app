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

const InputComponent = <T extends ValidElement>(
  { as, errors, className, ...props }: InputProps<T>,
  ref: ForwardedRef<RefType<T>>
) => {
  const Component = (as || "input") as ElementType;

  return (
    <div className="w-full">
      <Component
        {...props}
        ref={(el: RefType<T> | null) => {
          if (typeof ref === "function") {
            ref(el);
          } else if (ref && "current" in ref) {
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

const Input: React.FC<InputProps<ValidElement>> = forwardRef(
  InputComponent
) as React.FC<InputProps<ValidElement>>;

Input.displayName = "Input";

export default Input;
