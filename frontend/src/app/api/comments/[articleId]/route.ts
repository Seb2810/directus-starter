import { NextResponse } from 'next/server';
/*
req: Request, { params }: { params: { articleId: string } } ) {
Error: Route "/api/comments/[articleId]" used params.articleId. params should be awaited before using its properties.
 Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
*/
export async function GET(
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await context.params; // ✅ on attend la promesse ici

  const res = await fetch(
    `http://localhost:8056/items/comments?filter[article][_eq]=${articleId}&fields=id,content,date_created,author.first_name,author.last_name`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    console.error('❌ Directus error:', await res.text());
    return NextResponse.json([], { status: res.status });
  }

  const data = await res.json();
  console.log('✅ Comments fetched:', data.data);

  return NextResponse.json(data.data ?? []);
}

