"use client";

import React from "react";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  message?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, message }) => {
  // console.log("Label Props:", { htmlFor, children, message });
  return (
    <label htmlFor={htmlFor} className="w-[240px] font-bold text-gray-800">
      {children}
      {message && <span className="text-red-500 ml-2">{message}</span>}
    </label>
  );
};

export default Label;
