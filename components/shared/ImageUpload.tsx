"use client";

import * as React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export default function ImageUpload({ value, onChange, bucket = "site-assets" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {value ? (
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-80 transition shadow-md"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2 px-4 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Replace Image
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 5MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
