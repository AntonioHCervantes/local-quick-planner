'use client';
import Link from 'next/link';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Header() {
  const { exportData, importData, clearAll } = useStore();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importData(data);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="flex items-center justify-between bg-gray-950 px-4 py-2">
      <nav className="flex gap-4">
        <Link href="/my-day" className="hover:underline focus:underline">My Day</Link>
        <Link href="/my-tasks" className="hover:underline focus:underline">My Tasks</Link>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={exportData} aria-label="Export" className="p-2 rounded hover:bg-gray-800 focus:bg-gray-800">
          <Download className="h-4 w-4" />
        </button>
        <label aria-label="Import" className="p-2 rounded hover:bg-gray-800 focus-within:bg-gray-800 cursor-pointer">
          <Upload className="h-4 w-4" />
          <input type="file" accept="application/json" onChange={handleImport} className="sr-only" />
        </label>
        <button onClick={clearAll} aria-label="Clear all" className="p-2 rounded hover:bg-gray-800 focus:bg-gray-800">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
