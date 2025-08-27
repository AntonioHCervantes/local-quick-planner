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
      <g id="person">
        <circle
          cx="32"
          cy="20"
          r="5"
        />
        <path d="M20 48c4-8 8-12 12-12s8 4 12 12" />
        <path d="M20 48l-6 6" />
        <path d="M44 48l6 6" />
        <path d="M24 32l-4 8" />
        <path d="M40 32l4 8" />
      </g>
      <g id="thought">
        <circle
          cx="36"
          cy="14"
          r="2"
        />
        <circle
          cx="42"
          cy="10"
          r="3"
        />
        <rect
          x="48"
          y="2"
          width="14"
          height="12"
          rx="3"
          ry="3"
        />
        <g id="tasks">
          <g>
            <circle
              cx="52"
              cy="6"
              r="1"
              opacity="0"
              fill="currentColor"
              stroke="none"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1="55"
              y1="6"
              x2="60"
              y2="6"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
          </g>
          <g>
            <circle
              cx="52"
              cy="10"
              r="1"
              opacity="0"
              fill="currentColor"
              stroke="none"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1="55"
              y1="10"
              x2="60"
              y2="10"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </line>
          </g>
          <g>
            <circle
              cx="52"
              cy="14"
              r="1"
              opacity="0"
              fill="currentColor"
              stroke="none"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1="55"
              y1="14"
              x2="60"
              y2="14"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="2s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        </g>
      </g>
    </svg>
  );
}
