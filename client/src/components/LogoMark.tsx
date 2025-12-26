import React from "react";

export default function LogoMark({
  className,
  title = "MOSDAC Insight Engine",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <title>{title}</title>
      <path
        d="M6 16c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S6 21.523 6 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 16h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 10v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
      <circle cx="10" cy="16" r="1.25" fill="currentColor" opacity="0.8" />
      <circle cx="22" cy="16" r="1.25" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
