import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
 
   context: { params: Promise<{ slug: string }> }
) {



  const { slug } = await context.params; // ✅ on attend la promesse ici
  
  const res = await fetch(
    `http://localhost:8056/items/articles?filter[id][_eq]=${slug}&fields=id,title,content,date_created,slug`,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Article introuvable' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data.data?.[0] ?? null);
}

