'use client';

import type { SVGProps } from 'react';

export default function NoTasksIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      width="50%"
      height="50%"
      {...props}
    >
      <style>
        {`
          @keyframes slideInFromLeft {
            from { transform: translateX(-12px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes drawCheck {
            from { stroke-dashoffset: 26; opacity: 0; }
            to { stroke-dashoffset: 0; opacity: 1; }
          }
          .logo-line {
            opacity: 0;
            transform-origin: left center;
            animation: slideInFromLeft 0.6s ease-out forwards;
          }
          .logo-line-1 { animation-delay: 0.1s; }
          .logo-line-2 { animation-delay: 0.28s; }
          .logo-line-3 { animation-delay: 0.46s; }
          .logo-check {
            stroke-dasharray: 26;
            stroke-dashoffset: 26;
            animation: drawCheck 0.6s ease-out forwards;
            animation-delay: 0.6s;
          }
        `}
      </style>
      <rect
        x="26"
        y="27"
        width="28"
        height="3"
        rx="1.5"
        className="logo-line logo-line-1 fill-gray-500 dark:fill-gray-200"
      />
      <rect
        x="26"
        y="38"
        width="28"
        height="3"
        rx="1.5"
        className="logo-line logo-line-2 fill-gray-400 dark:fill-gray-300"
      />
      <rect
        x="26"
        y="49"
        width="14"
        height="3"
        rx="1.5"
        className="logo-line logo-line-3 fill-gray-300 dark:fill-gray-400"
      />
      <path
        d="M44 51L47 54L54 47"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-check stroke-gray-500 dark:stroke-gray-200"
        fill="none"
      />
    </svg>
  );
}
