import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden border-t border-primary-100 bg-[#fbfaf7] md:block">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-white">
            <Leaf className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold text-slate-800">CropWise AI</span>
        </div>
        <p suppressHydrationWarning>© {new Date().getFullYear()} CropWise AI. Same Land. New Insights. Stronger Futures.</p>
        <div className="flex gap-5">
          <Link href="/" className="hover:text-slate-800">Privacy</Link>
          <Link href="/" className="hover:text-slate-800">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
