"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Building2, Link2,} from "lucide-react";
import { Source } from "@/lib/types/source";
import { SourceFormValues, sourceSchema } from "@/lib/validations/sourceSchema";

type SourceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SourceFormValues) => void;
  isSubmitting: boolean;
  initialValues?: Source | null;
};

export function SourceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialValues,
}: SourceFormDialogProps) {
  const isEditMode = !!initialValues;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: { companyName: "", url: "", sourceType: "llm_extract" },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        companyName: initialValues.companyName,
        url: initialValues.url,
        sourceType: initialValues.sourceType as SourceFormValues["sourceType"],
      });
    } else {
      reset({ companyName: "", url: "", sourceType: "llm_extract" });
    }
  }, [initialValues, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl p-0 gap-0 overflow-hidden max-w-md border-line bg-base shadow-2xl">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 bg-ink/[0.02] border-b border-line">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shrink-0">
                <Database className="h-4.5 w-4.5 text-base" strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl text-ink">
                  {isEditMode ? "Edit source" : "Add a source"}
                </h2>
                <p className="text-muted text-xs mt-0.5">
                  {isEditMode ? "Update crawl settings for this source." : "A new company or board to track."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-7 py-6 flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-muted mb-2">
              <Building2 className="h-3.5 w-3.5" />
              Company name
            </label>
            <Input
              placeholder="e.g. Darse Technologies"
              {...register("companyName")}
              className={`h-11 rounded-xl bg-white ${
                errors.companyName ? "border-rust focus-visible:ring-rust/30" : "border-line"
              }`}
            />
            {errors.companyName && (
              <p className="text-rust text-xs mt-1.5">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-muted mb-2">
              <Link2 className="h-3.5 w-3.5" />
              Careers page URL
            </label>
            <Input
              placeholder="https://company.com/careers"
              {...register("url")}
              className={`h-11 rounded-xl bg-white ${
                errors.url ? "border-rust focus-visible:ring-rust/30" : "border-line"
              }`}
            />
            {errors.url && <p className="text-rust text-xs mt-1.5">{errors.url.message}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-muted mb-2 block">Source type</label>
            <Select
              value={watch("sourceType")}
              onValueChange={(value) => setValue("sourceType", value as SourceFormValues["sourceType"])}
            >
              <SelectTrigger className="h-11 rounded-xl bg-white border-line">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="llm_extract">LLM extract · custom site</SelectItem>
                <SelectItem value="greenhouse">Greenhouse</SelectItem>
                <SelectItem value="lever">Lever</SelectItem>
              </SelectContent>
            </Select>
            {errors.sourceType && (
              <p className="text-rust text-xs mt-1.5">{errors.sourceType.message}</p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl border-line text-ink hover:bg-ink/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl bg-ink text-base hover:bg-ink/90"
            >
              {isSubmitting
                ? isEditMode ? "Saving..." : "Adding..."
                : isEditMode ? "Save changes" : "Add source"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}