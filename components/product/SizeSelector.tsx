"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconX, IconRuler2 } from "@tabler/icons-react";
import { GlassTag } from "@/components/shared/GlassTag";
import { ALL_SIZES } from "@/lib/mock-products";

const SIZE_CONVERSION: Record<number, { us: number; uk: number }> = {
  36: { us: 5, uk: 3.5 },
  37: { us: 5.5, uk: 4 },
  38: { us: 6.5, uk: 5 },
  39: { us: 7, uk: 5.5 },
  40: { us: 7.5, uk: 6 },
  41: { us: 8.5, uk: 7 },
  42: { us: 9, uk: 7.5 },
  43: { us: 9.5, uk: 8.5 },
  44: { us: 10.5, uk: 9.5 },
  45: { us: 11, uk: 10 },
  46: { us: 12, uk: 11 },
};

export function SizeSelector({
  availableSizes,
  selected,
  onSelect,
}: {
  availableSizes: number[];
  selected: number | null;
  onSelect: (size: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Pointure (EU)</h3>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-1 text-xs font-medium text-yvann-gold-text hover:underline">
              <IconRuler2 size={14} /> Guide des tailles
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-text">
                  Guide des tailles
                </Dialog.Title>
                <Dialog.Close aria-label="Fermer">
                  <IconX size={18} className="text-text-muted" />
                </Dialog.Close>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-text-muted dark:border-slate-700">
                    <th className="py-2">EU</th>
                    <th className="py-2">US</th>
                    <th className="py-2">UK</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_SIZES.map((eu) => (
                    <tr key={eu} className="border-b border-slate-100 text-text dark:border-slate-800">
                      <td className="py-2">{eu}</td>
                      <td className="py-2">{SIZE_CONVERSION[eu]?.us ?? "—"}</td>
                      <td className="py-2">{SIZE_CONVERSION[eu]?.uk ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
        {ALL_SIZES.map((size) => (
          <GlassTag
            key={size}
            label={String(size)}
            selected={selected === size}
            disabled={!availableSizes.includes(size)}
            onToggle={() => onSelect(size)}
          />
        ))}
      </div>
    </div>
  );
}
