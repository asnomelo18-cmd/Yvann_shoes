"use client";

import { useState, useRef } from "react";

export function ProductGallery({ images }: { images: { url: string; angle: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex] ?? images[0];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !activeImage) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      backgroundImage: `url(${activeImage.url})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  }

  if (!activeImage) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.angle}
            onClick={() => setActiveIndex(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
              i === activeIndex ? "border-rho-blue-600" : "border-transparent"
            }`}
            aria-label={`Voir l'angle ${img.angle}`}
          >
            <img src={img.url} alt={img.angle} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Image principale + zoom */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomStyle({})}
        className="group relative aspect-square flex-1 overflow-hidden rounded-3xl bg-surface-2"
      >
        <img
          src={activeImage.url}
          alt={activeImage.angle}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 scale-150 bg-cover bg-no-repeat opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={zoomStyle}
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
          {activeImage.angle}
        </span>
      </div>
    </div>
  );
}
