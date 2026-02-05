// app/api/comments/new/route.ts
import { NextResponse } from 'next/server';
import { refreshDirectusToken } from '@/lib/directusAuth';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('body==== > ' , body)
  const { article, content, authorId  } = body;
  let { access_token, refresh_token} = body;

  console.log('📝 Comment reçu', { access_token, refresh_token, article, content, authorId });

  // 🧩 Étape 1 — Vérifier que le token existe
  if (!access_token && refresh_token ) {
    console.log("🔁 Pas de token valide, tentative de rafraîchir...");
    const refreshed = await refreshDirectusToken(refresh_token );
    if (refreshed?.access_token) {
      access_token = refreshed.access_token;
      refresh_token = refreshed.refresh_token;
    } else {
      return NextResponse.json({ error: "Impossible de régénérer le token" }, { status: 401 });
    }
  }

  // 🧩 Étape 2 — Tenter d’enregistrer le commentaire
  const res = await fetch('http://localhost:8056/items/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      content,
      article,
      author: authorId,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Erreur lors de l’ajout :", errText);

    // 🧩 Si token expiré → tenter un refresh automatique
    if (res.status === 401 &&  refresh_token) {
      console.log("🔁 Token expiré, tentative de refresh...");
      const refreshed = await refreshDirectusToken( refresh_token);

      if (refreshed?.access_token) {
        // On réessaie une fois avec le nouveau token
        const retry = await fetch('http://localhost:8056/items/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshed.access_token}`,
          },
          body: JSON.stringify({
            content,
            article,
            author: authorId,
          }),
        });

        if (retry.ok) {
          const retryData = await retry.json();
          return NextResponse.json({
            data: retryData,
            newToken: refreshed.access_token,
            newRefresh: refreshed.refresh_token,
          });
        }
      }
    }

    return NextResponse.json({ error: "Erreur lors de l’ajout" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

