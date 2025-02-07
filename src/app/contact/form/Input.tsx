"use client";

import { ElementType, ComponentPropsWithoutRef, forwardRef, Ref } from "react";
import { FieldError } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import clsx from "clsx";

type InputProps<T extends ElementType = "input"> = {
  as?: T;
  errors?: FieldError;
} & ComponentPropsWithoutRef<T>;

// `forwardRef` を適用
function Input<T extends ElementType = "input">(
  { as, errors, className, ...props }: InputProps<T>,
  ref: Ref<HTMLElement>
) {
  const getComponent = () => as || ("input" as ElementType);
  const Component = getComponent();

  return (
    <div className="w-full">
      <Component
        ref={ref}
        {...props}
        className={clsx(
          "border rounded-lg p-4 w-full",
          errors ? "border-red-500" : "border-gray-300",
          className
        )}
      />
      {errors?.message && <ErrorMessage message={errors.message} />}
    </div>
  );
}

//  `forwardRef` を適用して `Input` をエクスポート
const ForwardedInput = forwardRef(Input);

//  `displayName` を設定（デバッグ用）
ForwardedInput.displayName = "Input";

export default ForwardedInput;
