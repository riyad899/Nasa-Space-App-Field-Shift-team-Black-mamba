import React from "react";
import Link from "next/link";
import { LogIn, UserPlus, Leaf } from "lucide-react";

export default function AuthHubPage() {
  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-xl shadow-primary-900/5 sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-white">
          <Leaf className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">CropWise AI Account Access</h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Choose how you&apos;d like to continue
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <Link
          href="/signin"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-300 hover:bg-primary-50/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Sign In to Existing Account</h3>
              <p className="text-xs text-slate-400">Access your farm analyses and recommendations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/signup"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-300 hover:bg-primary-50/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Create New Account</h3>
              <p className="text-xs text-slate-400">Register as a farmer or field advisor</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 border-t border-primary-100 pt-4 text-center">
        <Link href="/" className="text-xs font-semibold text-slate-500 transition hover:text-slate-800">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
