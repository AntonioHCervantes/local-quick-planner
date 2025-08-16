'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="divide-y overflow-hidden rounded border shadow-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-900"
          >
            <button
              className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50 focus:outline-none focus:ring dark:hover:bg-gray-800"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              {isOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-sm text-gray-700 dark:text-gray-300">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
