import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type JobSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function JobSearchInput({ value, onChange, className = "" }: JobSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, company, or location..."
        className="h-12 pl-11 bg-white border-line rounded-xl text-black"
      />
    </div>
  );
}