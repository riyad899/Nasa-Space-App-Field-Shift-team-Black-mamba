import React from "react";
import Link from "next/link";
import { Laptop, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
        <Laptop className="h-10 w-10" />
      </div>
      <span className="mt-4 text-sm font-bold uppercase tracking-widest text-blue-600">
        404 Page Not Found
      </span>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Lost in Cyberspace?
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        The page or resource you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Home className="h-4 w-4" />
          Back to Storefront
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}
