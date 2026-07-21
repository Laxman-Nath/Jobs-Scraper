import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting?: boolean;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="rounded-3xl p-7 max-w-sm border-line bg-base shadow-2xl">

        <div className="w-12 h-12 rounded-2xl bg-rust/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-5 w-5 text-rust" strokeWidth={2} />
        </div>

        <h2 className="font-display font-semibold text-xl text-ink mb-1.5">
          Remove this source?
        </h2>
        <p className="text-muted text-sm leading-relaxed">
          <span className="font-medium text-ink">{itemName}</span> will stop being crawled and
          all its history will be removed. This can't be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl border-line text-ink hover:bg-ink/5"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-xl bg-rust text-white hover:bg-rust/90"
          >
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}