"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Upload, Copy, Trash2, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { deleteAsset } from "./actions";

type Asset = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: Date;
};

export function MediaLibrary({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
        const j = await res.json();
        if (!res.ok) {
          toast.error(j?.error || `Failed to upload ${file.name}`);
        }
      }
      router.refresh();
      toast.success("Uploaded");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied");
    setTimeout(() => setCopiedId(null), 1200);
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this image? It will be removed from disk.")) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      await deleteAsset(fd);
      toast.success("Deleted");
    });
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
        className="rounded-2xl border-2 border-dashed border-line bg-bg p-10 text-center hover:border-teal transition-colors"
      >
        <Upload className="h-7 w-7 text-teal mx-auto" strokeWidth={1.5} />
        <p className="mt-4 font-display text-xl text-ink">Drop images to upload</p>
        <p className="mt-1 text-sm text-ink-3">JPG, PNG, WebP, AVIF, SVG · up to 10MB each</p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-6 inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-bg text-sm font-medium hover:bg-teal-2 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Choose files"}
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={(e) => upload(e.target.files)} className="hidden" />
      </div>

      {assets.length === 0 ? (
        <p className="text-center text-ink-3 py-12">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((a) => (
            <div key={a.id} className="rounded-xl border border-line-soft bg-bg overflow-hidden group">
              <div className="relative aspect-square bg-bg-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt={a.filename} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-3 text-xs">
                <p className="text-ink truncate" title={a.filename}>{a.filename}</p>
                <p className="text-ink-4 mt-1 font-mono">
                  {(a.size / 1024).toFixed(0)} kB
                  {a.width && a.height && ` · ${a.width}×${a.height}`}
                </p>
                <p className="text-ink-4 mt-0.5">{format(a.createdAt, "d MMM")}</p>
                <div className="mt-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(a.url, a.id)}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-md border text-[10px] font-mono uppercase tracking-[0.16em] transition-colors",
                      copiedId === a.id ? "border-teal text-teal bg-teal/10" : "border-line text-ink-3 hover:border-teal hover:text-teal",
                    )}
                  >
                    {copiedId === a.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedId === a.id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(a.id)}
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:text-danger hover:bg-bg-2"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
