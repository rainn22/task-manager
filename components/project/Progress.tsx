"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import clsx from "clsx";

interface AnimatedProgressProps {
  value: number;
}

export function AnimatedProgress({ value }: AnimatedProgressProps) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => {
      setCurrent(value);
    });
  }, [value]);

  return (
    <Progress
      value={current}
      className={clsx(
        "h-2",
        mounted
          ? "transition-[transform] duration-700 ease-out"
          : "transition-none"
      )}
    />
  );
}
