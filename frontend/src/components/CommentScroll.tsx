'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  postComment,
  resetComments,
} from '@/store/commentScroll';

interface CommentsSectionProps {
  articleId: string;
   //nextCursor: string | null;
 // hasMore: boolean;
}
/*
ne  JAMAIS passer nextCursor ni hasMore en props
➡️ Ils viennent du Redux store, pas des props

*/

export default function CommentsSectionScroll({ articleId }: CommentsSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, nextCursor, hasMore } = useSelector(
    (state: RootState) => state.scroll
  );

  const [content, setContent] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // ✅ Reset + premier chargement
  useEffect(() => {
    dispatch(resetComments());
    dispatch(fetchComments({ articleId }));
  }, [dispatch, articleId]);

  // ✅ Infinite Scroll Observer
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        dispatch(fetchComments({ articleId, cursor: nextCursor }));
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [dispatch, nextCursor, hasMore, loading, articleId]);

  // ✅ Envoi commentaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('Veuillez vous connecter');
      return;
    }

    await dispatch(
      postComment({
        articleId,
        content,
        token,
        authorId: userId,
      })
    );

    setContent('');
    dispatch(resetComments());
    dispatch(fetchComments({ articleId }));
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Commentaires</h2>

      {items.map((c) => (
        <div key={c.id} className="border-b py-2">
          <p>{c.content}</p>
          <small className="text-gray-500">
            {c.author?.first_name} {c.author?.last_name} —{' '}
            {new Date(c.date_created).toLocaleDateString()}
          </small>
        </div>
      ))}

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!hasMore && <p className="text-gray-400">Plus aucun commentaire</p>}

      {/* 👇 déclencheur scroll */}
      <div ref={loaderRef} className="h-10" />

      {/* ✅ Formulaire */}
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre commentaire..."
          className="border p-2 w-full mb-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Envoyer
        </button>
      </form>
    </section>
  );
}
