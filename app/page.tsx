'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data: Note[] = await res.json();
      setNotes(data);
      setError(null);
    } catch {
      setError('Failed to load notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('Failed to add note');
      setTitle('');
      setContent('');
      setError(null);
      await fetchNotes();
    } catch {
      setError('Failed to add note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      await fetchNotes();
    } catch {
      setError('Failed to delete note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📝 Notes App
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
          <textarea
            placeholder="Note Content"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={addNote}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
            Add Note
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500">Loading notes...</div>
        )}
        <AnimatePresence>
          <ul className="space-y-4">
            {notes.map((note) => (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 p-4 rounded-lg flex justify-between items-start bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {note.title}
                  </h2>
                  <p className="text-gray-600">{note.content}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  aria-label="Delete note"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>

        {notes.length === 0 && !isLoading && (
          <p className="text-center text-gray-500">No notes yet. Add one!</p>
        )}
      </motion.div>
    </div>
  );
}
