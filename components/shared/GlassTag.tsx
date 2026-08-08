"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface GlassTagProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  swatchColor?: string; // pour le sélecteur de couleur produit
}

export function GlassTag({ label, selected, onToggle, disabled, swatchColor }: GlassTagProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        "text-text",
        selected && "border-yvann-gold-500 bg-yvann-gold-500/15 text-yvann-gold-text",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {swatchColor && (
        <span
          className="h-3 w-3 rounded-full border border-black/10"
          style={{ backgroundColor: swatchColor }}
        />
      )}
      {label}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            <IconCheck size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

interface GlassTagsProps {
  options: { value: string; label: string; swatchColor?: string; disabled?: boolean }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export function GlassTags({ options, selected, onChange }: GlassTagsProps) {
  function toggle(value: string) {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <GlassTag
          key={opt.value}
          label={opt.label}
          swatchColor={opt.swatchColor}
          disabled={opt.disabled}
          selected={selected.includes(opt.value)}
          onToggle={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}
