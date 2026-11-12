"use client";

import React, { useState, useEffect } from "react";
import { initials } from "@/lib/auth-context";

interface UserAvatarProps {
  user?: {
    name?: string;
    image?: string | null;
  } | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UserAvatar({ user, size = "sm", className = "" }: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if image changes
  useEffect(() => {
    setHasError(false);
  }, [user?.image]);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
  }[size];

  const imageUrl = user?.image && typeof user.image === "string" && user.image.trim().length > 0 ? user.image.trim() : null;

  if (imageUrl && !hasError) {
    return (
      <img
        src={imageUrl}
        alt={user?.name || "User profile"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
        className={`${sizeClasses} shrink-0 rounded-full object-cover ring-1 ring-slate-200/60 ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-primary-800 font-semibold text-white shadow-sm ${className}`}
    >
      {initials(user?.name)}
    </span>
  );
}
