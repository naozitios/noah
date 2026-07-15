"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  filename: string;
  path: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setMedia(data.media || []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: form,
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      load();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this file?")) return;

    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    load();
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Media</h1>

      <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 items-center">
        <input
          type="file"
          ref={fileRef}
          className="text-sm"
          onChange={upload}
          disabled={uploading}
        />
        {uploading && (
          <span className="text-sm text-muted-foreground ml-2">
            Uploading...
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : media.length === 0 ? (
        <p className="text-muted-foreground text-sm">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="bg-card border border-border rounded-lg p-3"
            >
              {m.mimeType?.startsWith("image/") ? (
                <img
                  src={m.path}
                  alt={m.filename}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-muted rounded mb-2 text-xs text-muted-foreground">
                  {m.mimeType || "Unknown"}
                </div>
              )}
              <div className="text-sm font-medium truncate">{m.filename}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {m.mimeType} · {formatBytes(m.sizeBytes)}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => copyPath(m.path)}
                  className="text-xs text-primary hover:underline"
                >
                  Copy path
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
