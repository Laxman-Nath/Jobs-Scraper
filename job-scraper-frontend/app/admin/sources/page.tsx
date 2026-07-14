"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSources, createSource, deleteSource, updateSource } from "@/lib/api/sources";
import { crawlSource } from "@/lib/api/jobs";

export default function AdminSourcesPage() {
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState("");
  const [url, setUrl] = useState("");
  const [sourceType, setSourceType] = useState("llm_extract");
  const [crawlingId, setCrawlingId] = useState<number | null>(null);

  const { data: sources, isLoading } = useQuery({
    queryKey: ["sources"],
    queryFn: getSources,
    refetchInterval: 30000,
  });

  const addSource = useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      setCompanyName("");
      setUrl("");
    },
  });

  const removeSource = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });

  const toggleEnabled = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      updateSource(id, { enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });

  async function handleCrawlNow(id: number) {
    setCrawlingId(id);
    try {
      await crawlSource(id);
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } finally {
      setCrawlingId(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName || !url) return;
    addSource.mutate({ companyName, url, sourceType });
  }

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-12 py-8">
      <h1 className="font-display text-3xl text-ink mb-6">Sources</h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-10 border-b border-line pb-8">
        <input
          type="text"
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="flex-1 bg-transparent border-b border-line focus:border-ink outline-none py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Careers page URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-transparent border-b border-line focus:border-ink outline-none py-2 text-sm"
        />
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="bg-transparent border-b border-line outline-none py-2 text-sm font-mono"
        >
          <option value="llm_extract">LLM extract</option>
          <option value="greenhouse">Greenhouse</option>
          <option value="lever">Lever</option>
        </select>
        <button
          type="submit"
          disabled={addSource.isPending}
          className="font-mono text-xs uppercase tracking-wide border border-ink px-4 py-2 hover:bg-ink hover:text-base transition-colors disabled:opacity-40"
        >
          {addSource.isPending ? "Adding..." : "Add source"}
        </button>
      </form>

      {isLoading && <p className="font-mono text-sm text-muted">Loading...</p>}

      {sources && (
        <div className="divide-y divide-line">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{source.companyName}</p>
                <p className="text-muted text-sm truncate">{source.url}</p>
                {source.lastError && (
                  <p className="text-rust text-xs font-mono mt-1 truncate">{source.lastError}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-muted">{source.jobsFoundLastRun} jobs</span>

                <span
                  className={`font-mono text-xs px-2 py-1 border ${
                    source.status === "active"
                      ? "border-signal text-signal"
                      : "border-rust text-rust"
                  }`}
                >
                  {source.status}
                </span>

                <button
                  onClick={() => handleCrawlNow(source.id)}
                  disabled={crawlingId === source.id}
                  className="font-mono text-xs border border-ink px-2 py-1 hover:bg-ink hover:text-base transition-colors disabled:opacity-40"
                >
                  {crawlingId === source.id ? "Crawling..." : "Crawl now"}
                </button>

                <button
                  onClick={() =>
                    toggleEnabled.mutate({ id: source.id, enabled: !source.enabled })
                  }
                  className="font-mono text-xs text-muted hover:text-ink transition-colors"
                >
                  {source.enabled ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => removeSource.mutate(source.id)}
                  className="font-mono text-xs text-muted hover:text-rust transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}