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
            className="underline text-blue-600 dark:text-blue-400 block max-w-full overflow-x-auto whitespace-nowrap [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600"
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
