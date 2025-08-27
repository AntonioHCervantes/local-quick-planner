'use client';

import type { SVGProps } from 'react';

export default function NoTasksIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="4"
        ry="4"
      />
      <path d="M24 16h16" />
      <path d="M20 24h24" />
      <path d="M20 32h24" />
      <path d="M20 40h24" />
      <polyline
        points="20 48 28 56 44 40"
        strokeDasharray="80"
        strokeDashoffset="80"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="80"
          to="0"
          dur="1.5s"
          fill="freeze"
          begin="0s"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  );
}
