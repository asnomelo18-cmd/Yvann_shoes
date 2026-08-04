"use client";

import { motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  key: string;
  label: string;
}

export function Stepper({ steps, currentIndex }: { steps: StepperStep[]; currentIndex: number }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && "border-rho-blue-600 bg-rho-blue-600 text-white",
                  isActive && "border-rho-blue-600 text-rho-blue-600",
                  !isDone && !isActive && "border-slate-300 text-text-muted dark:border-slate-700"
                )}
              >
                {isDone ? <IconCheck size={16} /> : i + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-xs font-medium",
                  isActive || isDone ? "text-text" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 bg-slate-200 dark:bg-slate-700">
                <motion.div
                  className="h-0.5 bg-rho-blue-600"
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
