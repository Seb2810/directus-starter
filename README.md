## Installer Directus
## Option A : en local avec npx
```js
npx create-directus-project my-directus-app
cd my-directus-app
npm run start
```

Par défaut, Directus va démarrer sur http://localhost:8055.
Tu pourras configurer un utilisateur admin au premier lancement.

## Option B : via Docker

Si tu préfères Docker :
```js
version: "3"
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    environment:
      KEY: "my-super-secret-key"
      SECRET: "my-super-secret-secret"
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "password"
      DB_CLIENT: "sqlite3"
      DB_FILENAME: "/data/database.sqlite"
    volumes:
      - ./directus-data:/data

```

Puis :
```js
docker-compose up -d
```

## 2. Créer une collection dans Directus

Dans l’interface admin (http://localhost:8055/admin), crée une collection (par ex. articles) avec des champs (title, content, image, etc.).

## 3. Installer Next.js

Dans un nouveau dossier :
```js
npx create-next-app my-next-app
cd my-next-app
```

## 4. Consommer l’API de Directus dans Next.js
Installer le SDK officiel Directus
```js
npm install @directus/sdk
```
Créer un client Directus (lib/directus.js)

```js
import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://localhost:8055').with(rest());

export default directus;
```
Exemple : récupérer des articles (pages/index.js)

```js
import directus from '../lib/directus';

export default async function Home() {
  const articles = await directus.items('articles').readByQuery({
    fields: ['id', 'title', 'content'],
  });

  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {articles.data.map((article) => (
          <li key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

```
## Lancer l'application

Lance Directus : npm run start (ou docker-compose up -d)

Lance Next.js : npm run dev

Va sur http://localhost:3000 → tu verras la liste de tes articles avec image + contenu 🎉

## Node version et installation de Directus

Directus ne supporte que Node.js 18.17 à 18.x (pas 20.x, pas 22.x pour l’instant).

si version > 20.x alors :
 2 Solutions : 
 1. utilser  NVM pour Windows mais cette solution peut poser problème (nvm-setup.exe) voir ci-dessous pour resolution dans cette exemple tout etait bloqué après
 2. <ins>desinstaller et reinstaller node manuellement avec la version recommandée par Directus</ins>
 
Télécharge NVM pour Windows :
👉 nvm-windows

(prends le fichier nvm-setup.exe).

Installe-le, puis ouvre un nouveau terminal PowerShell ou CMD.

Installe la version recommandée par Directus

Installe la version recommandée par Directus :

```js
nvm install 18.18.2
nvm use 18.18.2
```

Vérifie ta version :
```js
node -v
npm -v
```

Relance la commande :
```js
npx create-directus-project my-directus-app
```

si le probleme persiste sous Windows desinstaller MVN pour reinstaller la bonne version manuellement après

.Tapes pour désinstaller NVM sur Windows

## 1 .Désinstaller via le panneau de configuration

.Va dans : Panneau de configuration > Programmes > Programmes et fonctionnalités.

.Trouve NVM for Windows dans la liste.

.Cliques sur Désinstaller.

## 2.Supprimer le dossier d’installation de NVM

Par défaut, NVM s’installe ici :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm
```

## 3 .Supprime ce dossier à la main s’il reste.

Supprimer les versions de Node installées via NVM

Elles se trouvent dans :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm\v*
```

## 4 .Supprime les sous-dossiers v18.x, v20.x, etc.

Corriger les variables d’environnement

Clique droit sur Ce PC > Propriétés > Paramètres système avancés > Variables d’environnement.

## 5.Vérifie dans Path qu’il n’y a plus de lignes du type :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm
C:\Users\<TonNom>\AppData\Roaming\nvm\v18.18.2
```

Supprime-les si présentes.

## 6.Vérifie aussi si une variable NVM_HOME ou NVM_SYMLINK existe → supprime-les.

Réinstaller Node.js normalement

Va sur le site officiel : Node.js Downloads
.

Télécharge Node.js 18.18.2 LTS (Windows installer .msi).

Installe-le (ça remet aussi npm correctement).

## Une fois directus intaller lancer l'installation de next.js


## 7.Vérifie :
```js
node -v
npm -v
```

##  Où placer lib/directus.js ?

Dans Next.js, on a la liberté de créer un dossier lib/ à la racine du projet pour y mettre nos helpers, fonctions utilitaires, API clients, etc.

Arborescence typique après avoir suivi leur guide :
```js
my-website/
│
├── app/            # supprimé si tu recommences from scratch
├── lib/
│   └── directus.js # ici ton client Directus
├── node_modules/
├── package.json
└── next.config.js
```

Donc :
👉 lib est un dossier que tu crées manuellement à la racine de ton projet Next.js.

## Pourquoi supprimer app/ ?

Le guide te fait supprimer app/* pour repartir de zéro et montrer comment brancher Directus étape par étape.

Tu peux très bien garder app/ si tu veux (c’est le mode moderne de Next.js avec l’App Router).

Si tu supprimes app/, tu devras recréer des fichiers comme app/page.js ou pages/index.js (si tu veux revenir à l’ancien système).

👉 Bref :

Avec App Router → garde app/page.js.

Sans App Router (Pages Router) → crée pages/index.js.

## Quelle URL utiliser dans directus.js ?

Dans la doc ils mettent :
```js
const directus = createDirectus('https://directus.example.com').with(rest());

```

Mais ça c’est un exemple.
👉 Toi, tu dois mettre l’URL de ton instance Directus :

Si tu lances Directus en local → généralement :
```js
const directus = createDirectus('http://localhost:8055').with(rest());
```

Si plus tard tu déploies Directus en ligne → tu mets ton vrai domaine (ex: https://cms.monsite.com).

⚠️ Ce n’est pas localhost:3000 → ça c’est ton serveur Next.js.
Ton Directus tourne sur 8055 par défaut.

## Exemple complet (pages router)

👉 lib/directus.js :
```js
import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://localhost:8055').with(
  rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
  })
);

export default directus;
```

👉 pages/index.js :
```js
import directus from '../lib/directus';

export async function getServerSideProps() {
  const articles = await directus.items('articles').readByQuery({
    fields: ['id', 'title', 'content'],
  });

  return {
    props: {
      articles: articles.data ?? [],
    },
  };
}

export default function Home({ articles }) {
  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {articles.map((a) => (
          <li key={a.id}>
            <h2>{a.title}</h2>
            <p>{a.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

 Donc en résumé :

👉lib/ est à la racine du projet.

👉L’URL dans directus.js doit pointer vers Directus (localhost:8055), pas Next.js.

👉Tu choisis si tu bosses avec app/ (nouveau App Router) ou pages/ (ancien Pages Router).

## Exemple en TypeScript (lib/directus.ts)
```js
// lib/directus.ts
import { createDirectus, rest, RestClient, RestClientExtensions } from '@directus/sdk';

type Schema = {
  articles: {
    id: number;
    title: string;
    content: string;
    image: string;
  };
};

// On précise bien que le client est un RestClient avec les extensions REST
const directus: RestClient<Schema> & RestClientExtensions<Schema> =
  createDirectus<Schema>('http://localhost:8055').with(
    rest({
      onRequest: (options) => ({ ...options, cache: 'no-store' }),
    })
  );

export default directus;


```
Avantages de .ts au lieu de .js

Autocomplétion dans ton IDE : directus.items('articles') te propose directement id, title, content, etc.

Sécurité : si tu te trompes de champ ou de collection, TypeScript te prévient.

Pas besoin de any ou de cast manuel.

Où le mettre ?

Toujours dans ton projet Next.js :
```js
my-website/
├── app/
├── lib/
│   └── directus.ts   ✅
├── package.json
└── tsconfig.json
```
## 2. Page principale (app/page.tsx)

Dans l’App Router (app/), crée un fichier page.tsx :

// app/page.tsx
```js
import directus from "../lib/directus";

type Article = {
  id: number;
  title: string;
  content: string;
  image: string;
};

export default async function Home() {
  const articlesResponse = await directus.items("articles").readByQuery({
    fields: ["id", "title", "content", "image"],
    sort: ["-id"], // derniers articles en premier
  });

  const articles: Article[] = articlesResponse.data ?? [];

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Articles</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {articles.map((a) => (
          <li key={a.id} style={{ marginBottom: "2rem" }}>
            <h2>{a.title}</h2>
            {a.image && (
              <img
                src={`http://localhost:8055/assets/${a.image}`}
                alt={a.title}
                width={400}
              />
            )}
            <p>{a.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```
3. Résultat attendu

→Lance Directus sur http://localhost:8055.

Assure-toi d’avoir une collection articles avec des champs (title, content, image).

Lance Next.js :
```js
npm run dev

```

Va sur http://localhost:3000
 → tu verras tes articles affichés.

