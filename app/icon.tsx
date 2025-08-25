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
          viewBox="0 0 64 64"
          width="32"
          height="32"
        >
          <rect
            width="56"
            height="56"
            x="4"
            y="4"
            rx="10"
            fill="#ffffff"
          />
          <rect
            width="56"
            height="56"
            x="4"
            y="4"
            rx="10"
            fill="none"
            strokeWidth="2"
            stroke="#9ca3af"
          />
          <g transform="translate(14, 18)">
            <rect
              width="36"
              height="4"
              rx="2"
              fill="#9ca3af"
            />
            <rect
              x="0"
              y="12"
              width="28"
              height="4"
              rx="2"
              fill="#d1d5db"
            />
            <rect
              x="0"
              y="24"
              width="16"
              height="4"
              rx="2"
              fill="#d1d5db"
            />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
