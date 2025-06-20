// error-utils.ts
type AppError =
  | { status: number; data: { message?: string } } // RTK Query error format
  | { response?: { status: number; data: { message?: string } } } // Axios error format
  | { message: string } // Standard Error
  | string
  | unknown;

export function getErrorString(error: AppError): string {
  // Handle string errors
  if (typeof error === "string") return error;

  // Handle RTK Query errors
  if (isRejectedWithValue(error)) {
    const status =
      (error as any).payload?.status || (error as any).payload?.originalStatus;
    const message =
      (error as any).payload?.data?.message || "Unknown server error";
    return `${message} ${status ? `(Status: ${status})` : ""}`;
  }

  // Handle Axios-style errors
  if ((error as any)?.response?.data?.data?.message) {
    return (error as any).response.data.message;
  }

  if ((error as any)?.data?.message) {
    return (error as any).data.message;
  }

  // Handle FetchBaseQueryError (RTK Query network errors)
  if ((error as any)?.status === "FETCH_ERROR") {
    return "Network error - Please check your internet connection";
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error formats
  return "An unexpected error occurred";
}

// Type predicate for RTK Query rejection
function isRejectedWithValue(error: unknown): error is { payload: any } {
  return !!(error && typeof error === "object" && "payload" in error);
}
