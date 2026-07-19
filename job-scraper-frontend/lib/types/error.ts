export type ApiError = {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors?: { field: string; message: string }[] | null;
};

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: ApiError } };
    return axiosErr.response?.data?.message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function getFieldErrors(err: unknown): Record<string, string> {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: ApiError } };
    const fieldErrors = axiosErr.response?.data?.fieldErrors;
    if (fieldErrors) {
      return Object.fromEntries(fieldErrors.map((fe) => [fe.field, fe.message]));
    }
  }
  return {};
}

export function getErrorStatus(err: unknown): number | null {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { status?: number } };
    return axiosErr.response?.status ?? null;
  }
  return null;
}