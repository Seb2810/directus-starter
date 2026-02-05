/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, postComment } from '@/store/commentsSlice';


interface CommentsSectionProps {
  articleId: string;
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {

const dispatch = useDispatch<AppDispatch>();
  const { items: comments, loading, error } = useSelector(
    (state: RootState) => state.comments
  );
  const [content, setContent] = useState('');

  // 🔹 Charger les commentaires à l’ouverture
  useEffect(() => {
   dispatch(fetchComments(articleId)).then((res) => {
    console.log('🗨️ Fetched comments for', articleId, res);
  });
  }, [dispatch, articleId]);

  // 🔹 Envoyer un commentaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return alert('Veuillez vous connecter');
    const userId = localStorage.getItem('userId');
   //eviter cette erreur Type 'string | null' is not assignable to type 'string'.
    if (!userId) {
  alert('Utilisateur non connecté');
  console.log('no user id found !')
  return;
}
    const authorId = userId
  console.log(' user ok! ',userId)
    await dispatch(postComment({ articleId, content, token , authorId }));
    setContent('');
    dispatch(fetchComments(articleId)); // rafraîchit la liste
  }

  if (loading) return <p>Chargement des commentaires...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Commentaires</h2>

      {comments.length === 0 && <p>Aucun commentaire pour l’instant.</p>}

      {comments.map((c) => (
        <div key={c.id} className="border-b py-2">
          <p>{c.content}</p>
         {/*<small className="text-gray-500">
            {c.author?.first_name} {c.author?.last_name} —{' '}
            {new Date(c.date_created).toLocaleDateString()}
          </small>*/}
        </div>
      ))}

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





 /* const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 Charger les commentaires au montage
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments/${articleId}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [articleId]);

  // 🔹 Envoi d’un nouveau commentaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour commenter.');
      return;
    }

    if (!content.trim()) return;

    try {
      await fetch('/api/comments/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, article: articleId, token }),
      });

      setContent('');

      // 🔄 Rafraîchir la liste après ajout
      const updated = await fetch(`/api/comments/${articleId}`).then((r) => r.json());
      setComments(updated);
    } catch (err) {
      console.error('Erreur lors de l’envoi du commentaire:', err);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">💬 Commentaires</h2>

      {loading ? (
        <p>Chargement des commentaires...</p>
      ) : comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.id} className="border-b py-3">
            <p>{c.content}</p>
            <small className="text-gray-500">
              {c.author?.first_name} {c.author?.last_name} —{' '}
              {new Date(c.date_created).toLocaleDateString('fr-FR')}
            </small>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucun commentaire pour le moment.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre commentaire..."
          className="border p-2 w-full mb-2 rounded-md"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Envoyer
        </button>
      </form>
    </section>
  );*/
}
