"use client";

import React, { useState, useCallback } from "react";
import { MapPinIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

type LatLng = { lat: number; lng: number };

type Props = {
  value?: string; // current googleMapsEmbedUrl
  onChange: (embedUrl: string) => void;
};

function buildEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph`;
}

function buildOsmUrl(lat: number, lng: number, zoom = 15): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
}

export default function MapPinPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pinned, setPinned] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        setError("Location not found. Try a more specific address.");
        return;
      }
      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lon);
      setPinned({ lat: latNum, lng: lngNum });
      setAddress(display_name);
      onChange(buildEmbedUrl(latNum, lngNum));
    } catch {
      setError("Search failed. Please check your connection.");
    } finally {
      setIsSearching(false);
    }
  }, [query, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            weight="bold"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search address or place name…"
            className="w-full pl-8 pr-3 py-2 bg-muted/30 border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={isSearching || !query.trim()}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
        >
          {isSearching ? "…" : "Pin"}
        </button>
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-medium">{error}</p>
      )}

      {/* Map preview */}
      {pinned ? (
        <div className="space-y-2">
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm">
            <iframe
              src={buildOsmUrl(pinned.lat, pinned.lng)}
              className="w-full h-full border-0"
              loading="lazy"
              title="Location preview"
            />
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <MapPinIcon weight="duotone" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Pinned Location</p>
              <p className="text-[10px] text-muted-foreground leading-snug break-words">{address}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                {pinned.lat.toFixed(6)}, {pinned.lng.toFixed(6)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/60 italic">
            Google Maps embed URL has been updated automatically.
          </p>
        </div>
      ) : value ? (
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm">
          <iframe
            src={value}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            title="Current map"
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
          <MapPinIcon weight="duotone" className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-xs font-medium">Search an address above to pin your location</p>
        </div>
      )}

      {/* Manual URL fallback */}
      <details className="group">
        <summary className="text-[10px] text-muted-foreground/60 cursor-pointer hover:text-primary transition-colors select-none list-none flex items-center gap-1">
          <span className="group-open:hidden">▶</span>
          <span className="hidden group-open:inline">▼</span>
          Or paste Google Maps embed URL manually
        </summary>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=…"
          className="mt-2 w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-[10px] outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
        />
      </details>
    </div>
  );
}
