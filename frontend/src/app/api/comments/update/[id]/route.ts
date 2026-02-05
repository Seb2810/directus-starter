import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
 // { params }: { params: { id: string } used `params.id`. `params` should be awaited before using its properties.
 context: { params: Promise<{ id: string }> 
}
) {
  const token = req.headers.get('authorization');
  const body = await req.json();
 const { id } = await context.params; // ✅ on attend la promesse ici
  const res = await fetch(`http://localhost:8056/items/comments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ?? '',
    },
    body: JSON.stringify({ content: body.content }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Impossible de modifier.' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}