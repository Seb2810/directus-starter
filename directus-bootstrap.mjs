// directus-bootstrap.mjs
import { createDirectus, rest } from '@directus/sdk';
import 'dotenv/config';

const url = process.env.DIRECTUS_URL || 'http://directus:8055';

async function waitForDirectus(maxRetries = 20, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${url}/server/health`);
      if (res.ok) {
        console.log('✅ Directus est prêt !');
        return true;
      }
    } catch {
      console.log(`⏳ En attente de Directus... (tentative ${i + 1}/${maxRetries})`);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Directus n'est pas accessible après plusieurs tentatives.");
}

async function bootstrap() {
  console.log('🚀 Démarrage du bootstrap Directus sur :', url);
  await waitForDirectus();

  // 🔐 Authentification admin
  console.log('🔐 Connexion en tant qu’admin...');
  const loginRes = await fetch(`${url}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.DIRECTUS_ADMIN_EMAIL,
      password: process.env.DIRECTUS_ADMIN_PASSWORD,
    }),
  });

  if (!loginRes.ok) {
    throw new Error('Échec de la connexion admin : ' + (await loginRes.text()));
  }

  const loginData = await loginRes.json();
  const adminToken = loginData.data.access_token;
  console.log('✅ Admin connecté, token récupéré.');

  const client = createDirectus(url).with(rest());

  try {
    // 1️⃣ Vérification du rôle "Authenticated"
    console.log('🔍 Vérification du rôle "Authenticated"...');
    const checkRole = await fetch(`${url}/roles?filter[name][_eq]=Authenticated`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    const roleData = await checkRole.json();
    let roleId = roleData.data?.[0]?.id;

    if (!roleId) {
      console.log('⚙️ Création du rôle "Authenticated"...');
      const createRole = await fetch(`${url}/roles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Authenticated',
          description: 'Utilisateurs authentifiés via le front',
          admin_access: false,
          app_access: true,
        }),
      });

      const createdRole = await createRole.json();
      roleId = createdRole.data.id;
      console.log('✅ Rôle créé avec succès :', roleId);
    } else {
      console.log('ℹ️ Rôle déjà existant :', roleId);
    }

    // 2️⃣ Vérification / création de la policy
    console.log('🔍 Vérification de la policy "Authenticated Users Policy"...');
    const checkPolicy = await fetch(`${url}/items/directus_policies?filter[name][_eq]=Authenticated Users Policy`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    const policyData = await checkPolicy.json();
    let policyId = policyData.data?.[0]?.id;

    if (!policyId) {
      console.log('⚙️ Création de la policy...');
      const createPolicy = await fetch(`${url}/items/directus_policies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Authenticated Users Policy',
          description: 'Permissions de base pour les utilisateurs connectés',
          app_access: true,
        }),
      });

      const created = await createPolicy.json();
      policyId = created.data.id;
      console.log('✅ Policy créée :', policyId);
    } else {
      console.log('ℹ️ Policy déjà existante :', policyId);
    }

    // 3️⃣ Association du rôle et de la policy
    console.log('🔗 Association du rôle "Authenticated" à la policy...');
    const linkPolicy = await fetch(`${url}/roles/${roleId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policies: [policyId],
      }),
    });

    if (linkPolicy.ok) {
      console.log('✅ Policy associée au rôle avec succès.');
    } else {
      const err = await linkPolicy.text();
      console.error('❌ Erreur association rôle/policy:', err);
    }

    // 4️⃣ Vérification / création de la collection "comments"
    console.log('🗃️ Vérification de la collection "comments"...');
    const checkCollection = await fetch(`${url}/collections/comments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (checkCollection.status === 404) {
      console.log('⚙️ Création de la collection "comments"...');

      const createCollection = await fetch(`${url}/collections`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: 'comments',
          meta: {
            icon: 'comment',
            note: 'Commentaires liés aux articles',
          },
          schema: {
            name: 'comments',
          },
        }),
      });

      if (!createCollection.ok) {
        const errText = await createCollection.text();
        throw new Error('❌ Erreur création collection comments : ' + errText);
      }

      console.log('✅ Collection "comments" créée.');

      // Création des champs
      const fields = [
        { field: 'id', type: 'uuid', schema: { is_primary_key: true } },
        { field: 'content', type: 'text' },
        { field: 'author', type: 'uuid' },
        { field: 'article', type: 'uuid' },
        { field: 'created_at', type: 'timestamp' },
      ];

      for (const field of fields) {
        const res = await fetch(`${url}/fields/comments`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(field),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`❌ Erreur création champ ${field.field}:`, errText);
        } else {
          console.log(`✅ Champ "${field.field}" ajouté.`);
        }
      }
    } else {
      console.log('ℹ️ Collection "comments" déjà existante.');
    }

    // 5️⃣ Permissions CRUD
    console.log('📝 Création des permissions pour "comments"...');
    const permissions = [
      { collection: 'comments', action: 'create', permissions: {}, fields: ['*'] },
      { collection: 'comments', action: 'read', permissions: {}, fields: ['*'] },
      {
        collection: 'comments',
        action: 'update',
        permissions: { author: { id: { _eq: '$CURRENT_USER' } } },
        fields: ['content'],
      },
      {
        collection: 'comments',
        action: 'delete',
        permissions: { author: { id: { _eq: '$CURRENT_USER' } } },
      },
    ];

    for (const perm of permissions) {
      const response = await fetch(`${url}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...perm, policy: policyId }),
      });

      if (response.ok) {
        console.log(`✅ Permission "${perm.collection}.${perm.action}" créée.`);
      } else {
        const err = await response.text();
        console.error(`❌ Erreur création permission "${perm.action}":`, err);
      }
    }

    console.log('🎉 Bootstrap Directus terminé avec succès !');
  } catch (err) {
    console.error('❌ Erreur durant le bootstrap :', err);
  }
}

bootstrap();
