"use client";

import { WithChildren } from "../../types/commonTypes";

interface LabelProps extends WithChildren {
  htmlFor: string;
}

export default function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="w-[240px] font-bold text-gray-800">
      {children}
    </label>
  );
}
