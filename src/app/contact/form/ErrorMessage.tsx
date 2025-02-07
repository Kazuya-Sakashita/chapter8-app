import React from "react";
import { ErrorMessageProps } from "../../types/commonTypes";

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
}
