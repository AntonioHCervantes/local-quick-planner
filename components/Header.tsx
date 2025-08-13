'use client';
import Link from 'next/link';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../lib/store';

export default function Header() {
  const { exportData, importData, clearAll } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    clearAll();
    setShowConfirm(false);
  };

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
    <>
      <header className="flex items-center justify-between bg-gray-950 px-4 py-2">
        <nav className="flex gap-4">
          <Link
            href="/my-day"
            className="hover:underline focus:underline"
          >
            My Day
          </Link>
          <Link
            href="/my-tasks"
            className="hover:underline focus:underline"
          >
            My Tasks
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={exportData}
            aria-label="Export"
            className="p-2 rounded hover:bg-gray-800 focus:bg-gray-800"
          >
            <Download className="h-4 w-4" />
          </button>
          <label
            aria-label="Import"
            className="p-2 rounded hover:bg-gray-800 focus-within:bg-gray-800 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="sr-only"
            />
          </label>
          <button
            onClick={() => setShowConfirm(true)}
            aria-label="Clear all"
            className="p-2 rounded hover:bg-gray-800 focus:bg-gray-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-gray-900 p-6 text-center text-gray-100">
            <p className="mb-4">
              Se recomienda que exporte el Dashboard para poder recuperar el
              trabajo en cualquier momento importando el dashboard.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600 focus:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-3 py-1 hover:bg-red-500 focus:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
