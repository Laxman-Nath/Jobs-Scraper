import { Input } from "@/components/ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

type AuthFormFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
};

export function AuthFormField({ label, type, placeholder, registration, error }: AuthFormFieldProps) {
  return (
    <div>
      <label className="text-xs font-mono text-muted mb-1.5 block">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`h-12 bg-white rounded-xl text-black ${error ? "border-rust focus-visible:ring-rust/30" : "border-line"}`}
      />
      {error && <p className="text-rust text-xs mt-1.5">{error}</p>}
    </div>
  );
}