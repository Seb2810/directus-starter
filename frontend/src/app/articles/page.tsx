// C:\Users\Collinet\Documents\test-directus\frontend\src\app\articles
'use client';

import { fetchArticles } from '@/store/articlesSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchArticles } from '@/store/postsSlice';
//import type { RootState, AppDispatch } from '@/store';

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: posts, loading, error } = useSelector(
    (state: RootState) => state.articles
  );


  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>
<a href={`/articles/${post.id}`}>{post.title}</a>
            </h2>
            <span>
              &bull; {post.date_created} 
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
