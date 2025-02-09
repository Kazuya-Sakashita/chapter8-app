import React from "react";
import { ErrorMessageProps } from "../../_types/commonTypes";
const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};

export default ErrorMessage;
