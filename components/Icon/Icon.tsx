'use client';

export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      role="img"
      aria-label="Local Quick Planner"
      width="40"
      height="40"
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
        y="25"
        width="30"
        height="5"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <rect
        x="25"
        y="35"
        width="30"
        height="5"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <rect
        x="25"
        y="45"
        width="20"
        height="5"
        rx="2"
        className="fill-white dark:fill-gray-800"
      />
      <path
        d="M45 50L49 54L57 46"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white dark:stroke-gray-800"
        fill="none"
      />
    </svg>
  );
}
