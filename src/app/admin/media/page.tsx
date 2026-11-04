'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Copy,
  Check,
  Search,
  Filter,
  ExternalLink,
  RefreshCw,
  Folder,
} from 'lucide-react';

interface MediaItem {
  name: string;
  url: string;
  size: string;
  folder: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState<'all' | 'images' | 'collections'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredMedia = media.filter((item) => {
    const matchesFolder = folderFilter === 'all' || item.folder === folderFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Asset Library</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse downloaded high-resolution assets, banners, and thumbnails. Click any asset to copy its path.
          </p>
        </div>
        <button
          onClick={fetchMedia}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Assets ({media.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search image filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Folder className="w-4 h-4 text-zinc-400" />
          <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
            {(['all', 'images', 'collections'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFolderFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  folderFilter === f
                    ? 'bg-amber-500 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-400 ml-2">
            {filteredMedia.length} assets
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
          Scanning local public asset directory...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
          No media files found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isCopied = copiedUrl === item.url;
            return (
              <div
                key={item.url}
                className="group relative rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between"
              >
                {/* Image Box */}
                <div
                  className="relative aspect-square w-full bg-zinc-950 cursor-pointer overflow-hidden"
                  onClick={() => setPreviewImage(item.url)}
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="180px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="text-[10px] text-white font-semibold bg-zinc-900/90 px-2 py-1 rounded-md border border-zinc-700">
                      Preview
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-2.5 bg-zinc-900 border-t border-zinc-800 text-[10px] space-y-1">
                  <p className="font-semibold text-zinc-200 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>{item.size}</span>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                      }`}
                      title="Copy URL path"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh]">
              <Image
                src={previewImage}
                alt="Enlarged Preview"
                fill
                className="object-contain"
                sizes="800px"
              />
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
              <span className="font-mono text-zinc-300">{previewImage}</span>
              <button
                onClick={() => copyToClipboard(previewImage)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold"
              >
                Copy Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
