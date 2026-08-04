"use client";

import * as Select from "@radix-ui/react-select";
import { IconChevronDown, IconCheck } from "@tabler/icons-react";

export type SortValue = "pertinence" | "prix-asc" | "prix-desc" | "nouveautes" | "notes";

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "notes", label: "Meilleures notes" },
];

export function SortSelect({ value, onChange }: { value: SortValue; onChange: (v: SortValue) => void }) {
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as SortValue)}>
      <Select.Trigger className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-text dark:border-slate-700">
        <Select.Value />
        <Select.Icon>
          <IconChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-lg dark:border-slate-700">
          <Select.Viewport className="p-1">
            {OPTIONS.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-text outline-none data-[highlighted]:bg-surface-2"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <IconCheck size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
