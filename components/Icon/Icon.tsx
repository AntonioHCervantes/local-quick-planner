'use client';

export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      role="img"
      aria-label="Local Quick Planner"
      width="80"
      height="80"
    >
      <rect
        x="15"
        y="15"
        width="50"
        height="50"
        rx="10"
        className="fill-black dark:fill-white"
      />
      <rect
        x="25"
        y="25.25"
        width="30"
        height="3"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <rect
        x="25"
        y="38.5"
        width="30"
        height="3"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <rect
        x="25"
        y="51.5"
        width="12"
        height="3"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <path
        d="M44 53L47 56L54 49"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white dark:stroke-gray-800"
        fill="none"
      />
    </svg>
  );
}
