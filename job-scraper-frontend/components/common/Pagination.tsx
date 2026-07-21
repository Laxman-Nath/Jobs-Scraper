type PaginationProps = {
  page: number; 
  totalPages: number;
  onPageChange: (newPageNo: number) => void; 
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const currentPageNo = page + 1; 
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-line pt-6 mt-6">
      <button
        onClick={() => onPageChange(currentPageNo - 1)}
        disabled={currentPageNo <= 1}
        className="font-mono text-xs uppercase tracking-wide border border-ink px-4 py-2 hover:bg-ink hover:text-base transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        ← Prev
      </button>

      <span className="font-mono text-xs text-muted">
        Page {currentPageNo} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPageNo + 1)}
        disabled={currentPageNo >= totalPages}
        className="font-mono text-xs uppercase tracking-wide border border-ink px-4 py-2 hover:bg-ink hover:text-base transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        Next →
      </button>
    </div>
  );
}