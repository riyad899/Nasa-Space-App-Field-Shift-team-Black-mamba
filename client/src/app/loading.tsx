import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        <div className="h-6 w-6 rounded-full bg-blue-50"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
        Loading TechSpace...
      </p>
    </div>
  );
}
