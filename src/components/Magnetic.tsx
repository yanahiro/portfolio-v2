"use client";

import React from "react";
import { useMagnetic } from "@/lib/useMagnetic";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  as?: "span" | "div";
  strength?: number;
  radius?: number;
  children: React.ReactNode;
};

export default function Magnetic({
  as = "span",
  strength,
  radius,
  children,
  className,
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLSpanElement>({ strength, radius });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={`inline-block will-change-transform ${className ?? ""}`} {...rest}>
      {children}
    </Tag>
  );
}
