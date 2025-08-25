'use client';

export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Local Quick Planner"
      width="40"
      height="40"
    >
      <rect
        width="56"
        height="56"
        x="4"
        y="4"
        rx="10"
        className="fill-white dark:fill-gray-800"
      />
      <rect
        width="56"
        height="56"
        x="4"
        y="4"
        rx="10"
        fill="none"
        strokeWidth="2"
        className="stroke-gray-200 dark:stroke-gray-700"
      />

      <g transform="translate(14, 18)">
        <rect
          width="36"
          height="4"
          rx="2"
          className="fill-gray-400 dark:fill-gray-400"
        />
        <rect
          x="0"
          y="12"
          width="28"
          height="4"
          rx="2"
          className="fill-gray-300 dark:fill-gray-500"
        />
        <rect
          x="0"
          y="24"
          width="16"
          height="4"
          rx="2"
          className="fill-gray-300 dark:fill-gray-500"
        />
      </g>
    </svg>
  );
}
