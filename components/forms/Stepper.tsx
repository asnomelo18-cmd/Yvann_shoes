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
          <div key={step.key} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-0 flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors sm:h-8 sm:w-8",
                  isDone && "border-yvann-gold-600 bg-yvann-gold-600 text-white",
                  isActive && "border-yvann-gold-600 text-yvann-gold-700",
                  !isDone && !isActive && "border-slate-300 text-text-muted dark:border-slate-700"
                )}
              >
                {isDone ? <IconCheck size={16} /> : i + 1}
              </div>
              <span
                className={cn(
                  "max-w-[4.5rem] truncate text-center text-[11px] font-medium sm:max-w-none sm:whitespace-nowrap sm:text-xs",
                  isActive || isDone ? "text-text" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1 h-0.5 flex-1 bg-slate-200 dark:bg-slate-700 sm:mx-2">
                <motion.div
                  className="h-0.5 bg-yvann-gold-600"
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
