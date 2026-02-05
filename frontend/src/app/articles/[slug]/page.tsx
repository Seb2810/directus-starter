import { notFound } from 'next/navigation';
import { Article } from '@/lib/directus';
import CommentsSection from '@/components/CommentsSection';


async function getArticle(slug: string): Promise<Article | null> {
  
  console.log('slug send = ' ,slug)
  
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/single/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const article = await res.json();

  console.log(' article ' , article)

  return article ?? null;
}


export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  


  const { slug } = await params;
  
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-6">
        Publié le {new Date(article.date_created).toLocaleDateString()}
      </p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* 💬 Section des commentaires */}
      <CommentsSection articleId={article.id} />
    </article>
  );
}
