import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
 // { params }: { params: { id: string }  used `params.id`. `params` should be awaited before using its properties.
 context: { params: Promise<{ id: string }> 
}
) {
  const token = req.headers.get('authorization');

  const { id } = await context.params; // ✅ on attend la promesse ici

  const res = await fetch(`http://localhost:8056/items/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token ?? '' },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Impossible de supprimer.' }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}