import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 80"
          width="32"
          height="32"
        >
          <rect
            x="15"
            y="15"
            width="50"
            height="50"
            rx="10"
            fill="#ffffff"
          />
          <rect
            x="25"
            y="25.25"
            width="30"
            height="3"
            rx="2"
            fill="#1f2937"
          />
          <rect
            x="25"
            y="38.5"
            width="30"
            height="3"
            rx="2"
            fill="#1f2937"
          />
          <rect
            x="25"
            y="51.5"
            width="12"
            height="3"
            rx="2"
            fill="#1f2937"
          />
          <path
            d="M44 53L47 56L54 49"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#1f2937"
            fill="none"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
