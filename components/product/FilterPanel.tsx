"use client";

import * as Slider from "@radix-ui/react-slider";
import { GlassTags } from "@/components/shared/GlassTag";
import { BRANDS, ALL_SIZES, ALL_COLORS } from "@/lib/mock-products";
import { formatPrice } from "@/lib/utils";

export interface BoutiqueFilters {
  brands: string[];
  categories: string[];
  sizes: string[];
  colors: string[];
  usages: string[];
  priceRange: [number, number];
}

const CATEGORY_OPTIONS = [
  { value: "sneakers", label: "Sneakers" },
  { value: "running", label: "Running" },
  { value: "ville", label: "Ville" },
  { value: "training", label: "Training" },
];

const USAGE_OPTIONS = [
  { value: "running", label: "Running" },
  { value: "streetwear", label: "Streetwear" },
  { value: "training", label: "Training" },
  { value: "ville", label: "Ville" },
  { value: "sport", label: "Sport" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: BoutiqueFilters;
  onChange: (filters: BoutiqueFilters) => void;
}) {
  function update<K extends keyof BoutiqueFilters>(key: K, value: BoutiqueFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-7">
      <FilterGroup title="Marque">
        <GlassTags
          options={BRANDS.map((b) => ({ value: b, label: b }))}
          selected={filters.brands}
          onChange={(v) => update("brands", v)}
        />
      </FilterGroup>

      <FilterGroup title="Catégorie">
        <GlassTags
          options={CATEGORY_OPTIONS}
          selected={filters.categories}
          onChange={(v) => update("categories", v)}
        />
      </FilterGroup>

      <FilterGroup title="Usage">
        <GlassTags
          options={USAGE_OPTIONS}
          selected={filters.usages}
          onChange={(v) => update("usages", v)}
        />
      </FilterGroup>

      <FilterGroup title="Pointure (EU)">
        <GlassTags
          options={ALL_SIZES.map((s) => ({ value: String(s), label: String(s) }))}
          selected={filters.sizes}
          onChange={(v) => update("sizes", v)}
        />
      </FilterGroup>

      <FilterGroup title="Couleur">
        <GlassTags
          options={ALL_COLORS.map((c) => ({ value: c.name, label: c.name, swatchColor: c.hex }))}
          selected={filters.colors}
          onChange={(v) => update("colors", v)}
        />
      </FilterGroup>

      <FilterGroup title="Prix">
        <div className="px-1">
          <Slider.Root
            className="relative flex h-5 w-full touch-none items-center"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={1000}
            value={filters.priceRange}
            onValueChange={(v) => update("priceRange", v as [number, number])}
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-slate-200 dark:bg-slate-700">
              <Slider.Range className="absolute h-full rounded-full bg-yvann-gold-600" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full bg-yvann-gold-600 shadow focus:outline-none focus:ring-2 focus:ring-yvann-gold-400" />
            <Slider.Thumb className="block h-4 w-4 rounded-full bg-yvann-gold-600 shadow focus:outline-none focus:ring-2 focus:ring-yvann-gold-400" />
          </Slider.Root>
          <div className="mt-2 flex justify-between text-xs text-text-muted">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text">{title}</h3>
      {children}
    </div>
  );
}

export const DEFAULT_FILTERS: BoutiqueFilters = {
  brands: [],
  categories: [],
  sizes: [],
  colors: [],
  usages: [],
  priceRange: [MIN_PRICE, MAX_PRICE],
};
