'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logoutUser, restoreSession } from '@/store/authSlice';
import { useEffect } from 'react';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // 🔹 Restaurer la session à chaque rechargement
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold hover:text-blue-400">
          📰 Mon Blog
        </Link>
        <Link href="/articles" className="hover:text-blue-400">
          Articles
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              Bonjour, <strong>{user.first_name}</strong>
            </span>

            <Link href="/my-comments" className="text-blue-600 hover:underline">
              Mes commentaires
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 transition"
            >
              S’inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
