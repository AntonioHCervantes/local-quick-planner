'use client';

import type { SVGProps } from 'react';

export default function NoTasksIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      width="50%"
      height="50%"
      {...props}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInFromLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .board-outline {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .task-line {
            animation: slideInFromLeft 0.5s ease-out forwards;
          }
          .task-line-1 { animation-delay: 0s; }
          .task-line-2 { animation-delay: 0.2s; }
          .task-line-3 { animation-delay: 0.4s; }
          .task-line-4 { animation-delay: 0.6s; }
          .task-line-5 { animation-delay: 0.8s; }
        `}
      </style>

      {/* Tareas apareciendo en cascada */}
      <g transform="translate(25, 5)">
        <rect
          width="50"
          height="1"
          rx="0.5"
          className="task-line task-line-1 fill-gray-500 dark:fill-gray-400"
          style={{ opacity: 0 }}
        />
        <rect
          y="4"
          width="45"
          height="1"
          rx="0.5"
          className="task-line task-line-2 fill-gray-400 dark:fill-gray-500"
          style={{ opacity: 0 }}
        />
        <rect
          y="8"
          width="40"
          height="1"
          rx="0.5"
          className="task-line task-line-3 fill-gray-300 dark:fill-gray-600"
          style={{ opacity: 0 }}
        />
        <rect
          y="12"
          width="35"
          height="1"
          rx="0.5"
          className="task-line task-line-4 fill-gray-200 dark:fill-gray-700"
          style={{ opacity: 0 }}
        />
        <rect
          y="16"
          width="30"
          height="1"
          rx="0.5"
          className="task-line task-line-5 fill-gray-100 dark:fill-gray-800"
          style={{ opacity: 0 }}
        />
      </g>
    </svg>
  );
}
