"use client";

import { IconAlertTriangle } from "@tabler/icons-react";

export interface VariantStockMap {
  [key: string]: number; // clé "size-color" → stock
}

export function variantKey(size: number, color: string) {
  return `${size}__${color}`;
}

export function VariantStockGrid({
  sizes,
  colors,
  stock,
  onChange,
}: {
  sizes: number[];
  colors: string[];
  stock: VariantStockMap;
  onChange: (stock: VariantStockMap) => void;
}) {
  if (sizes.length === 0 || colors.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Sélectionnez au moins une pointure et un coloris pour définir le stock par combinaison.
      </p>
    );
  }

  function setCell(size: number, color: string, value: number) {
    onChange({ ...stock, [variantKey(size, color)]: value });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
          <tr>
            <th className="px-3 py-2.5 text-left">Pointure \ Coloris</th>
            {colors.map((color) => (
              <th key={color} className="px-3 py-2.5 text-center">
                {color}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sizes.map((size) => (
            <tr key={size}>
              <td className="px-3 py-2 font-medium text-text">{size}</td>
              {colors.map((color) => {
                const qty = stock[variantKey(size, color)] ?? 0;
                return (
                  <td key={color} className="px-3 py-2 text-center">
                    <div className="mx-auto flex w-20 items-center justify-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => setCell(size, color, Math.max(0, Number(e.target.value)))}
                        className="w-16 rounded-lg border border-slate-300 bg-transparent px-2 py-1 text-center text-sm text-text focus:border-yvann-gold-500 focus:outline-none dark:border-slate-700"
                      />
                      {qty === 0 && (
                        <IconAlertTriangle
                          size={14}
                          className="shrink-0 text-yvann-warningText"
                          aria-label="Rupture de stock"
                        />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
