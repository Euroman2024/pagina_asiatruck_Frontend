"use client";

import { useRef, useState } from "react";

const MAX_FILE_MB = 2;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImagePicker({
  images,
  onChange,
  multiple = true,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  /** Con false se permite una sola imagen: elegir otra reemplaza la anterior */
  multiple?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);
    const tooBig = files.find((file) => file.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" pesa más de ${MAX_FILE_MB}MB. Elige una imagen más liviana.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
      onChange(multiple ? [...images, ...dataUrls] : dataUrls.slice(-1));
    } catch {
      setError("No se pudo leer alguna de las imágenes.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="text-sm text-zinc-700 file:mr-3 file:rounded-full file:border-0 file:bg-black/[.06] file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-950 hover:file:bg-black/[.1] dark:text-zinc-300 dark:file:bg-white/[.1] dark:file:text-zinc-50 dark:hover:file:bg-white/[.15]"
      />

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-md border border-black/[.08] dark:border-white/[.145]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
