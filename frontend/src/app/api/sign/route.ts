/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Lis le corps une seule fois
    const text = await req.text();
    console.log('📦 Requête brute reçue :', text);

    const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN; 

    const AUTH_ROLE_ID =process.env.DIRECTUS_USER_ROLE_ID

    if (!text) {
      return NextResponse.json({ error: 'Body vide' }, { status: 400 });
    }

    const { email, password, firstName, lastName } = JSON.parse(text);

    console.log('✅ Body parsé :', { email, password, firstName, lastName });

    // 🔹 Appel à Directus pour créer un utilisateur
    const res = await fetch('http://localhost:8056/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: AUTH_ROLE_ID, 
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Erreur Directus :', errorText);
      return NextResponse.json({ error: 'Erreur Directus', details: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('❗ Erreur API Sign:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
