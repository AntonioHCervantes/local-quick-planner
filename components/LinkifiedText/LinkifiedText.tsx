import React from 'react';

interface LinkifiedTextProps {
  text: string;
}

export default function LinkifiedText({ text }: LinkifiedTextProps) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noreferrer noopener"
            title={part}
            className="underline text-blue-600 dark:text-blue-400 block max-w-full truncate"
            onClick={e => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}
