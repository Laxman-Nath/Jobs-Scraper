"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  getSources,
  createSource,
  updateSource,
  deleteSource,
} from "@/lib/api/sources";
import { crawlSource } from "@/lib/api/jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Source } from "@/lib/types/source";
import Pagination from "../../components/Pagination";
import { SourceFormValues } from "@/lib/validations/sourceSchema";
import { SourceFormDialog } from "@/app/components/SourceFormDialog";
import { DeleteConfirmDialog } from "@/app/components/DeleteConfirmationDialog";

export default function AdminSourcesPage() {
  const queryClient = useQueryClient();
  const [pageNo, setPageNo] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [crawlingId, setCrawlingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Source | null>(null);

  const { data: sourcesPage, isLoading } = useQuery({
    queryKey: ["sources", pageNo],
    queryFn: () => getSources(pageNo, 20),
  });

  const createMutation = useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Source> }) =>
      updateSource(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      setDialogOpen(false);
      setEditingSource(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      setDeleteTarget(null);
    },
  });

  function handleConfirmDelete() {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  }

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

  function handleFormSubmit(values: SourceFormValues) {
    if (editingSource) {
      updateMutation.mutate({ id: editingSource.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  }

  function openAddDialog() {
    setEditingSource(null);
    setDialogOpen(true);
  }

  function openEditDialog(source: Source) {
    setEditingSource(source);
    setDialogOpen(true);
  }

  return (
    <main className="px-6 md:px-12 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink mb-1">
            Sources
          </h1>
          <p className="text-muted text-sm">
            Companies and boards being crawled.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="h-11 rounded-xl bg-ink text-base hover:bg-ink/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add source
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white border border-line animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {sourcesPage?.content.map((source, i) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                source.enabled
                  ? "bg-white border-line"
                  : "bg-line/20 border-line/50 opacity-60"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold truncate ${source.enabled ? "text-ink" : "text-muted"}`}
                  >
                    {source.companyName}
                  </p>
                  {!source.enabled && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs border-muted text-muted shrink-0"
                    >
                      Disabled
                    </Badge>
                  )}
                </div>
                <p className="text-muted text-sm truncate">{source.url}</p>
                {source.lastError && (
                  <p className="text-rust text-xs font-mono mt-1 truncate">
                    {source.lastError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-muted hidden sm:inline">
                  {source.jobsFoundLastRun} jobs
                </span>

                {source.enabled && (
                  <Badge
                    variant="outline"
                    className={`rounded-full text-xs ${
                      source.status === "active"
                        ? "border-signal text-signal"
                        : "border-rust text-rust"
                    }`}
                  >
                    {source.status}
                  </Badge>
                )}

                <button
                  onClick={() => handleCrawlNow(source.id)}
                  disabled={crawlingId === source.id || !source.enabled}
                  title="Crawl now"
                  className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${crawlingId === source.id ? "animate-spin" : ""}`}
                  />
                </button>

                <button
                  onClick={() => openEditDialog(source)}
                  title="Edit"
                  className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    toggleEnabled.mutate({
                      id: source.id,
                      enabled: !source.enabled,
                    })
                  }
                  className="font-mono text-xs text-muted hover:text-ink transition-colors px-2"
                >
                  {source.enabled ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => setDeleteTarget(source)}
                  title="Remove"
                  className="p-2 rounded-lg text-muted hover:text-rust hover:bg-rust/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {sourcesPage && (
        <div className="mt-8">
          <Pagination
            page={sourcesPage.page}
            totalPages={sourcesPage.totalPages}
            onPageChange={setPageNo}
          />
        </div>
      )}

      <SourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialValues={editingSource}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.companyName ?? ""}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}
