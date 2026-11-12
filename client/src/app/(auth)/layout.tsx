import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Auth Layout: strictly NO header and NO footer, clean centered auth content
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fbfaf7] px-4 py-8 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-100 via-[#fbfaf7] to-[#fbfaf7]" />
      <main className="relative z-10 w-full max-w-md">{children}</main>
    </div>
  );
}
