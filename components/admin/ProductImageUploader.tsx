"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { IconPhotoPlus, IconX, IconLoader2, IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function ProductImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} n'est pas une image.`);
          continue;
        }
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        uploaded.push(blob.url);
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast.success(`${uploaded.length} photo(s) ajoutée(s).`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveTo(from: number, to: number) {
    if (from === to) return;
    const next = [...images];
    const moved = next.splice(from, 1)[0];
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) moveTo(dragIndex, i);
              setDragIndex(null);
            }}
            className={cn(
              "group relative aspect-square cursor-move overflow-hidden rounded-xl border border-slate-200 bg-surface-2 dark:border-slate-800",
              dragIndex === i && "opacity-50"
            )}
          >
            <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-yvann-gold-600 px-2 py-0.5 text-[10px] font-semibold text-yvann-black-950">
                Principale
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Retirer cette photo"
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <IconX size={13} />
            </button>
            <div className="absolute bottom-1.5 right-1.5 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <IconGripVertical size={13} />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 text-text-muted transition-colors hover:border-yvann-gold-500 hover:text-yvann-gold-700 disabled:opacity-60 dark:border-slate-700"
        >
          {uploading ? (
            <IconLoader2 size={22} className="animate-spin" />
          ) : (
            <IconPhotoPlus size={22} />
          )}
          <span className="text-xs">{uploading ? "Envoi..." : "Ajouter"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-2 text-xs text-text-muted">
        JPEG, PNG, WebP ou AVIF, 8 Mo max par photo. La première photo est utilisée comme image
        principale — glisse-dépose pour réordonner.
      </p>
    </div>
  );
}
